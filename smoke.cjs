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
    await page.locator("#open-social").waitFor();
    assert.deepEqual((await state()).systems, ["social", "crew", "perception"]);
    await page.locator("#open-social").click();
    await page.waitForFunction(
      () =>
        window.render_game_to_text && JSON.parse(render_game_to_text()).ready,
    );
    await page.locator("#loading").waitFor({ state: "hidden" });
    const first = await state();
    assert.equal(first.runsTested, 40);
    assert.equal(first.changed.length, 25);
    assert.equal(first.original.counts.east, 40);
    assert.equal(first.alternative.counts.east, 15);
    assert.match(await page.locator("#answer-a").textContent(), /Esme/);
    assert.match(await page.locator("#answer-b").textContent(), /programme/);
    const selectedCrowd = await page.locator("#to-crew").getAttribute("href");
    assert.match(selectedCrowd, /seed=746&hold=31&run=altered/);
    await page.locator("#evidence summary").click();
    await page
      .getByRole("button", { name: "Replay Esme to Finn at 7.5 s" })
      .click();
    assert.equal((await state()).tick, 75);
    await page.locator("#checkpoint").click();
    const fork = await state();
    assert.deepEqual(fork.original.people, fork.alternative.people);
    assert.deepEqual(fork.original.evidence, fork.alternative.evidence);
    await page.locator("#end").click();
    const zero = await page
      .locator("#messenger option")
      .evaluateAll(
        (items) =>
          items.find((o) => o.textContent.endsWith("· 0 changed")).value,
      );
    await page.locator("#messenger").selectOption(zero);
    await page.waitForFunction(
      () => JSON.parse(render_game_to_text()).changed?.length === 0,
    );
    await page.locator("#best").click();
    await page.waitForFunction(
      () => JSON.parse(render_game_to_text()).changed?.length === 25,
    );
    await page.locator("#witness").selectOption("3");
    assert.equal((await state()).witness, "Ida");
    await page.locator("#new").click();
    await page.waitForFunction(
      () => JSON.parse(render_game_to_text()).seed === 747,
    );
    await page.locator("#play").click();
    await page.waitForFunction(() => JSON.parse(render_game_to_text()).playing);
    await page.locator("#play").click();
    assert.equal((await state()).playing, false);
    assert.deepEqual(errors, []);
    console.log(
      "Verified the ranked interventions, shared checkpoint, witness evidence, scrubbing, replay and a new crowd.",
    );
    const listeningURL = new URL(url);
    listeningURL.search = "?room";
    await page.goto(listeningURL.href);
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
    const waitLab = (mode) =>
      page.waitForFunction((m) => {
        if (!window.render_game_to_text) return false;
        const s = JSON.parse(render_game_to_text());
        return s.mode === m && s.ready;
      }, mode);
    await page.goto(new URL(selectedCrowd, url).href);
    await waitLab("crew");
    assert.equal((await state()).audience, 15);
    assert.ok(!(await state()).jobs.includes("zone"));
    await page.locator("#attendance").selectOption("original");
    assert.equal((await state()).baseEnd, 215);
    await page.locator("#apply").click();
    const repair = await state();
    assert.equal(repair.incident.t, 39);
    assert.equal(repair.finish, 241);
    assert.equal(repair.keptTeamsEnd, 329);
    await page.locator("#finish").click();
    assert.match(
      await page.locator("#scene-caption").textContent(),
      /complete/,
    );
    await page.locator("#restore").click();
    await page.locator("#who").selectOption("0");
    await page.locator("#duration").selectOption("200");
    await page.locator("#apply").click();
    assert.equal((await state()).incident.until, 239);
    assert.equal((await state()).incident.absent, 0);
    await page.locator("#restore").click();
    assert.equal((await state()).incident, null);
    await page.locator("#scrub").fill("0");
    assert.equal((await state()).tick, 0);
    await page
      .getByRole("navigation", { name: "NPC systems" })
      .getByText("Perception & search")
      .click();
    await waitLab("perception");
    assert.deepEqual((await state()).visible, [true, false, false]);
    await page.locator("#search-start").click();
    await page.locator("#finish").click();
    assert.deepEqual((await state()).inspected, ["Catalogue", "Dispatch"]);
    await page.locator("#compare-screen").click();
    await page.locator("#finish").click();
    assert.deepEqual((await state()).inspected, ["Dispatch"]);
    await page.locator("#send-record").click();
    await waitLab("crew");
    assert.equal((await state()).recordReady, 96);
    assert.ok(
      (await state()).assignments.find((a) => a.id === "sound").start >= 96,
    );
    await page.locator("#to-archive").click();
    await waitLab("perception");
    await page.locator("#bin").selectOption("intake");
    await page.locator("#screen").selectOption("closed");
    assert.equal((await state()).seen, true);
    await page.locator("#finish").click();
    assert.deepEqual((await state()).inspected, ["Intake"]);
    await page
      .getByRole("navigation", { name: "NPC systems" })
      .getByText("NPC Systems", { exact: true })
      .click();
    await waitLab("home");
    assert.equal((await state()).mode, "home");
    assert.deepEqual(errors, []);
    console.log(
      "Verified all three systems, crowd-to-crew handoff, alternative assignments, occlusion, search evidence and return navigation.",
    );
  } finally {
    await browser.close();
  }
}
check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
