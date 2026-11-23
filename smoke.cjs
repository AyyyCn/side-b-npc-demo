const assert = require("node:assert/strict");
const { chromium } = require("playwright");

async function check() {
  const channel = process.env.BROWSER_CHANNEL;
  const options = channel
    ? {
        channel,
        args: process.platform === "darwin" ? ["--use-angle=metal"] : [],
      }
    : {
        args: [
          "--use-gl=angle",
          "--use-angle=swiftshader",
          "--enable-unsafe-swiftshader",
        ],
      };
  const browser = await chromium.launch(options);
  try {
    const page = await browser.newPage({
      viewport: { width: 960, height: 660 },
    });
    page.setDefaultTimeout(60000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const state = () =>
      page.evaluate(() => JSON.parse(window.render_game_to_text()));
    const url = process.env.DEMO_URL || "http://127.0.0.1:19447/";
    await page.goto(url);
    await page.locator("#nell").waitFor();

    for (const route of [
      {
        first: "nell",
        arrivals: ["kit", "finn", "ida"],
        sources: ["you", "nell", "kit", "finn", "", ""],
        ida: "Finn told me.",
        silas: "What show?",
      },
      {
        first: "silas",
        arrivals: ["silas"],
        sources: ["", "", "", "", "you", ""],
        ida: "What show?",
        silas: "You did. Just a moment ago.",
      },
    ]) {
      await page.locator("#" + route.first).click();
      await page.waitForFunction(
        () => JSON.parse(render_game_to_text()).phase === "spreading",
      );
      await page.evaluate(() => advanceTime(16000));
      const scene = await state();
      assert.equal(scene.phase, "concert");
      assert.deepEqual(
        scene.people.filter((p) => p.arrived).map((p) => p.id),
        route.arrivals,
      );
      assert.deepEqual(
        scene.people.map((p) => p.source),
        route.sources,
      );

      for (const guest of ["Ida", "Silas"]) {
        await page
          .getByRole("button", { name: "Ask " + guest, exact: true })
          .click();
        const expected = route[guest.toLowerCase()];
        await page.waitForFunction(
          (text) => JSON.parse(render_game_to_text()).line === text,
          expected,
        );
        assert.equal(await page.locator("#quote").textContent(), expected);
      }
      await page.locator("#reset").click();
      await page.waitForFunction(
        () => JSON.parse(render_game_to_text()).phase === "choose",
      );
      assert.ok((await state()).people.every((p) => !p.source && !p.arrived));
    }
    await page.locator("#camera").click();
    assert.match(await page.locator("#camera").textContent(), /Wide/);
    await page.locator("#sound").click();
    assert.equal(
      await page.locator("#sound").getAttribute("aria-pressed"),
      "false",
    );
    assert.deepEqual(errors, []);
    console.log(
      "Verified both invitation paths, interviews, replay, camera, and sound.",
    );
  } finally {
    await browser.close();
  }
}
check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
