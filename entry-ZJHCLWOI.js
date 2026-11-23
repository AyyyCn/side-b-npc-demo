/*!
Three.js

The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

meshoptimizer

MIT License

Copyright (c) 2016-2026 Arseny Kapoulkine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Earcut

ISC License

Copyright (c) 2024, Mapbox

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

*/
import{b as a}from"./chunks/chunk-UVDLXQQY.js";import"./chunks/chunk-KXWL3TAT.js";var n=`<style>
  * {
    box-sizing: border-box;
  }
  html,
  body {
    margin: 0;
    min-height: 100%;
    background: #101214;
    color: #eeeae0;
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
  }
  body {
    display: grid;
    place-items: center;
    min-height: 100svh;
  }
  main {
    width: min(100%, 1800px);
  }
  .stage {
    aspect-ratio: 16/9;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: #262725;
  }
  canvas,
  #actors {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  .stage::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      #0c10136b,
      transparent 19%,
      transparent 68%,
      #1011138a
    );
  }
  header {
    position: absolute;
    z-index: 2;
    left: 3%;
    right: 3%;
    top: 4%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    pointer-events: none;
  }
  h1 {
    margin: 0;
    font:
      600 clamp(18px, 2vw, 34px) / 1 "Helvetica Neue",
      Arial,
      sans-serif;
    letter-spacing: -0.045em;
  }
  .brand {
    font-weight: 400;
    color: #e4d6c5;
    border-right: 1px solid #d8d0c48c;
    padding-right: 0.75em;
    margin-right: 0.6em;
    font-size: 0.58em;
    letter-spacing: 0.09em;
    vertical-align: 0.15em;
  }
  nav,
  .row {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    align-items: center;
  }
  nav {
    pointer-events: auto;
  }
  button,
  input {
    font: inherit;
  }
  button {
    cursor: pointer;
    border: 1px solid #857c7066;
    border-radius: 4px;
    padding: 9px 13px;
    background: #282828;
    color: #e8e5dc;
    font-size: 13px;
    letter-spacing: 0.005em;
  }
  button:hover,
  button:focus-visible,
  button[aria-pressed="true"]:not(#sound) {
    background: #4a443b;
    border-color: #bcb3a2;
  }
  header button {
    background: #1c1e1ddc;
    font-size: 12px;
  }
  button.primary {
    background: #e9dbc3;
    color: #29271f;
  }
  button.primary:hover {
    background: #f6ebd8;
  }
  #chain {
    position: absolute;
    left: 3%;
    top: 12%;
    z-index: 3;
    color: #f1e4ca;
    background: #171a19c9;
    padding: 7px 11px;
    font-size: clamp(11px, 1vw, 16px);
    border-left: 2px solid #d5a56b;
  }
  #chain small {
    display: block;
    color: #d7b989;
    font-size: 0.69em;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    margin-bottom: 0.32em;
  }
  #path {
    white-space: nowrap;
  }
  #screen-controls {
    position: absolute;
    inset: auto 0 5% 0;
    z-index: 5;
    text-align: center;
  }
  #screen-play {
    background: #e6d8be;
    color: #2e251d;
    padding: 0.8em 1.3em;
    border: 0;
  }
  #screen-play:disabled {
    opacity: 0.4;
  }
  #actors {
    z-index: 1;
    pointer-events: none;
  }
  #actors button {
    position: absolute;
    transform: translate(-50%, -100%);
    padding: 0;
    border: 0;
    background: transparent;
    pointer-events: auto;
  }
  #actors button:focus-visible {
    outline: 1px solid #dccba8;
  }
  #actors button span {
    position: absolute;
    bottom: -1.4em;
    left: 50%;
    transform: translateX(-50%);
    color: #f9f4e9;
    background: #191b1be0;
    border-radius: 2px;
    padding: 3px 6px;
    font-size: 12px;
    opacity: 0;
  }
  #actors button:hover span,
  #actors button:focus-visible span,
  #actors button.speaking span {
    opacity: 1;
  }
  #actors button:disabled {
    pointer-events: none;
  }
  #subtitle {
    position: absolute;
    z-index: 3;
    bottom: 5%;
    left: 8%;
    right: 8%;
    text-align: center;
    font-size: clamp(16px, 1.8vw, 29px);
    font-weight: 500;
    color: white;
    text-shadow:
      0 2px 6px black,
      0 0 15px #171511;
    pointer-events: none;
  }
  footer {
    padding: 17px 3% 19px;
    display: grid;
    align-items: center;
    grid-template-columns: minmax(200px, 0.8fr) minmax(360px, 1.2fr);
    gap: 18px;
    border-top: 1px solid #72665a88;
    background: #191b1c;
  }
  #label {
    color: #c6a988;
    font-size: 11px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }
  h2 {
    font-size: clamp(16px, 1.5vw, 24px);
    letter-spacing: -0.035em;
    line-height: 1.24;
    margin: 6px 0 0;
    font-weight: 500;
  }
  .actions {
    display: grid;
    gap: 7px;
    justify-items: end;
  }
  .row {
    justify-content: flex-end;
  }
  #cast button {
    border: 0;
    padding: 5px 8px;
    background: transparent;
    color: #cfcbc1;
  }
  #cast button[aria-pressed="true"] {
    color: #fff;
    background: #4b4136;
  }
  form {
    display: inline-flex;
    gap: 3px;
  }
  input {
    background: #282a2a;
    border: 1px solid #756c61;
    color: #f6f1e6;
    border-radius: 3px;
    width: 160px;
    padding: 8px;
    font-size: 13px;
  }
  #reply {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  [hidden] {
    display: none !important;
  }
  .screening main {
    width: 100%;
  }
  .screening footer,
  .screening nav,
  .screening #actors span {
    display: none;
  }
  .screening #chain {
    top: 4.4%;
    left: auto;
    right: 3%;
  }
  .screening header {
    top: 4.4%;
  }
  @media (max-width: 760px) {
    footer {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .actions {
      justify-items: start;
    }
    .row {
      justify-content: flex-start;
    }
    header button {
      padding: 5px 7px;
      font-size: 10px;
    }
    header {
      left: 2%;
      right: 2%;
    }
    #chain {
      top: 17%;
    }
    #subtitle {
      font-size: 14px;
    }
    .stage {
      aspect-ratio: 1.78;
    }
    button {
      font-size: 12px;
      padding: 7px;
    }
    #reply {
      position: static;
      width: auto;
      height: auto;
      clip-path: none;
      font-size: 14px;
      color: #d8bb97;
      margin-top: 4px;
    }
  }

  #subtitle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35em;
    text-wrap: balance;
  }
  #subtitle:empty {
    display: none;
  }
  #context:empty,
  #quote:empty {
    display: none;
  }
  #context {
    font-size: 0.73em;
    color: #e9ddc7;
  }
  #quote {
    text-shadow:
      0 2px 12px black,
      0 1px 3px black;
  }
  .screening #subtitle {
    bottom: 6.2%;
    left: 4%;
    right: 4%;
    font-size: clamp(20px, 2.45vw, 48px);
    letter-spacing: -0.023em;
  }
  .screening #context {
    font-size: 0.58em;
    letter-spacing: 0.005em;
  }
  .screening .stage::after {
    background: linear-gradient(
      180deg,
      #0d101530,
      transparent 22%,
      transparent 56%,
      #101015a8
    );
  }
  .screening #actors {
    display: none;
  }
  .screening #chain {
    top: 5.1%;
    right: 4%;
    padding: 10px 17px;
    font-size: clamp(13px, 1.2vw, 24px);
  }
  .screening header {
    left: 4%;
    top: 5.1%;
  }
  .screening h1 {
    font-size: clamp(20px, 2.1vw, 41px);
  }
  #speaker {
    font-size: 0.56em;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #f1d7b2;
    margin-right: 0.7em;
    vertical-align: 0.12em;
  }
  #speaker:empty {
    display: none;
  }
  #line {
    line-height: 1.2;
  }
  #stage-status {
    display: none;
  }
  .screening #stage-status {
    display: block;
    position: absolute;
    z-index: 4;
    left: 8%;
    right: 8%;
    bottom: 8%;
    text-align: center;
    margin: 0;
    color: #e7decb;
    font-size: clamp(15px, 1.7vw, 26px);
  }
</style>
<main>
  <section class="stage" aria-label="Three-dimensional listening room">
    <canvas></canvas>
    <p id="stage-status" role="status">Opening the listening room\u2026</p>
    <div id="actors"></div>
    <header>
      <h1><span class="brand">ARCADE</span>Side B</h1>
      <nav>
        <button id="camera">Camera \xB7 Auto</button
        ><button id="sound" aria-pressed="true">Sound on</button
        ><button id="reset" hidden>Restart</button>
      </nav>
    </header>
    <div id="chain" aria-label="Invitation history" hidden>
      <small>Invitation path</small><span id="path"></span>
    </div>
    <div id="subtitle">
      <div id="context"></div>
      <div id="line"><span id="speaker"></span><span id="quote"></span></div>
    </div>
    <div id="screen-controls" hidden>
      <button id="screen-play">Play demo</button>
    </div>
  </section>
  <footer>
    <div aria-live="polite">
      <div id="label">Listening room</div>
      <h2 id="prompt">Opening the room\u2026</h2>
      <div id="reply"></div>
    </div>
    <div class="actions">
      <div id="cast" class="row" aria-label="Question a guest" hidden></div>
      <div class="row">
        <button id="nell" class="primary" hidden>Tell Nell \xB7 bartender</button
        ><button id="silas" hidden>Tell Silas \xB7 regular</button>
      </div>
      <div id="queries" class="row" hidden>
        <button data-kind="source">Who told you?</button
        ><button data-kind="place">Where\u2019s the show?</button
        ><button data-kind="work">Busy tonight?</button>
        <form hidden>
          <input
            aria-label="Ask in your own words"
            placeholder="Your question\u2026"
            maxlength="120"
            required
          /><button>Ask</button>
        </form>
      </div>
    </div>
  </footer>
</main>
`;var o=`<style>
  * {
    box-sizing: border-box;
  }
  :root {
    --paper: #f2f0e8;
    --ink: #222a26;
    --muted: #5e655c;
    --rule: #c5c7bb;
    --east: #80cbb3;
    --west: #e3b082;
  }
  html,
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
    margin: 0;
  }
  body {
    min-height: 100vh;
  }
  main {
    max-width: 2010px;
    margin: auto;
    padding: clamp(18px, 2.3vw, 45px) clamp(18px, 3.6vw, 72px)
      clamp(26px, 2.5vw, 52px);
  }
  .mast,
  .brand,
  .tools,
  .transport,
  .pairhead,
  .issue,
  .witness-heading,
  .controls,
  .summary {
    display: flex;
    align-items: center;
  }
  .mast {
    justify-content: space-between;
    border-bottom: 1px solid var(--rule);
    padding-bottom: clamp(10px, 1.15vw, 24px);
  }
  .brand {
    gap: 16px;
    font-size: clamp(13px, 1vw, 20px);
    color: var(--muted);
  }
  .brand b {
    font-size: clamp(22px, 1.8vw, 35px);
    letter-spacing: -0.065em;
    color: var(--ink);
  }
  .brand span {
    border-left: 1px solid #a8ad9f;
    padding-left: 16px;
  }
  .tools {
    gap: 18px;
    font-size: 13px;
  }
  .tools a {
    color: var(--muted);
    text-underline-offset: 3px;
  }
  .seed-label,
  .time,
  .run-no,
  .quantity,
  .clock,
  .eyebrow {
    font-variant-numeric: tabular-nums;
  }
  .seed-label {
    font-size: clamp(12px, 0.94vw, 18px);
    font-weight: 540;
    color: var(--muted);
  }
  .headline {
    padding: clamp(15px, 2vw, 39px) 0 clamp(15px, 1.7vw, 33px);
  }
  h1 {
    margin: 0;
    font-size: clamp(34px, 3.75vw, 76px);
    font-weight: 570;
    letter-spacing: -0.057em;
    line-height: 1.03;
  }
  .headline p {
    font-size: clamp(15px, 1.31vw, 26px);
    color: var(--muted);
    letter-spacing: -0.018em;
    line-height: 1.35;
    margin: 0.43em 0 0;
  }
  #arenas {
    position: relative;
    width: 100%;
    height: clamp(280px, 26vw, 525px);
    overflow: hidden;
    border: 1px solid #323c35;
    background: #26322d;
  }
  canvas {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    display: block;
    cursor: crosshair;
  }
  .pane {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    padding: clamp(11px, 1.3vw, 26px);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(
      #15231eb0,
      transparent 27%,
      transparent 77%,
      #15211ca6
    );
  }
  .pane.a {
    left: 0;
    border-right: 1px solid #82938870;
  }
  .pane.b {
    left: 50%;
  }
  .pairhead {
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }
  .run-no {
    font-size: clamp(10px, 0.82vw, 16px);
    color: #cad7cc;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  .pairhead h2 {
    margin: 0.17em 0 0;
    font-size: clamp(20px, 1.78vw, 36px);
    font-weight: 500;
    letter-spacing: -0.045em;
    color: #f8f4e8;
  }
  .quantity {
    display: flex;
    gap: 0.28em;
    align-items: baseline;
    white-space: nowrap;
    color: var(--east);
    font-size: clamp(11px, 0.87vw, 18px);
  }
  .quantity b {
    font-size: clamp(24px, 2.35vw, 48px);
    font-weight: 550;
    letter-spacing: -0.065em;
    color: #d9f1df;
    font-variant-numeric: tabular-nums;
  }
  .rooms {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    color: #e7e7d8;
    letter-spacing: 0.035em;
    font-size: clamp(12px, 0.93vw, 19px);
  }
  .rooms span::before {
    content: "";
    display: inline-block;
    width: 0.52em;
    height: 0.52em;
    border-radius: 50%;
    background: var(--west);
    margin-right: 0.53em;
    vertical-align: 0.03em;
  }
  .rooms span + span::before {
    background: var(--east);
  }
  #loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    text-align: center;
    background: #26322d;
    color: #f4f0e1;
    font-size: 18px;
    z-index: 2;
    padding: 20px;
  }
  button,
  select,
  input {
    font: inherit;
  }
  button,
  select {
    border: 1px solid #b7bdb0;
    background: #f4f3ec;
    color: var(--ink);
    border-radius: 5px;
    padding: 7px 10px;
    font-size: 13px;
    cursor: pointer;
  }
  button:hover,
  select:hover {
    border-color: #717e6b;
  }
  button:focus-visible,
  select:focus-visible,
  input:focus-visible,
  summary:focus-visible,
  a:focus-visible {
    outline: 2px solid #367b6a;
    outline-offset: 2px;
  }
  button:disabled,
  select:disabled {
    opacity: 0.5;
    cursor: wait;
  }
  .transport {
    gap: 14px;
    min-height: 56px;
    border-bottom: 1px solid var(--rule);
    padding: 10px 0;
  }
  .primary {
    background: #243d33;
    border-color: #243d33;
    color: #f2f5e8;
    font-weight: 550;
    min-width: 96px;
  }
  .primary:hover {
    background: #345044;
  }
  .time {
    font-size: 14px;
    white-space: nowrap;
    font-weight: 560;
  }
  .scrub {
    flex: 1;
    min-width: 35px;
    accent-color: #356d58;
    width: 100%;
  }
  .controls {
    gap: 12px;
    flex-wrap: wrap;
    padding: 12px 0;
    border-bottom: 1px solid var(--rule);
  }
  label {
    font-size: 13px;
    font-weight: 560;
  }
  select {
    margin-left: 5px;
  }
  .controls .fine {
    font-weight: 400;
    font-size: 13px;
    color: var(--muted);
    margin-left: auto;
  }
  .witness-heading {
    justify-content: space-between;
    margin: clamp(12px, 1.6vw, 30px) 0 10px;
    gap: 12px;
  }
  .witness-heading h2 {
    margin: 0;
    font-size: clamp(17px, 1.5vw, 30px);
    letter-spacing: -0.035em;
    font-weight: 550;
  }
  .testimony {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3%;
  }
  .answer {
    border-left: 2px solid #718c77;
    padding-left: clamp(11px, 1vw, 20px);
  }
  .answer .eyebrow {
    color: var(--muted);
    font-size: clamp(10px, 0.78vw, 15px);
    text-transform: uppercase;
    font-weight: 590;
    letter-spacing: 0.075em;
  }
  blockquote {
    margin: 0.24em 0 0;
    font-size: clamp(17px, 1.5vw, 31px);
    letter-spacing: -0.032em;
    line-height: 1.17;
    font-weight: 500;
  }
  details {
    margin-top: 14px;
    color: var(--muted);
    font-size: 14px;
  }
  summary {
    cursor: pointer;
    max-width: max-content;
    text-underline-offset: 3px;
  }
  .trail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3%;
    margin: 12px 0 0;
  }
  .trail ol {
    padding-left: 22px;
    margin: 0;
    line-height: 1.5;
  }
  [hidden] {
    display: none !important;
  }
  .pitch .interactive {
    display: none !important;
  }
  .pitch .witness-heading {
    margin: clamp(16px, 1.9vw, 36px) 0 12px;
  }
  .pitch .transport {
    border-bottom: none;
    min-height: 48px;
    gap: 17px;
  }
  .pitch progress {
    width: 100%;
    flex: 1;
    height: 4px;
    appearance: none;
    border: 0;
    background: #c3c9bd;
  }
  .pitch progress::-webkit-progress-bar {
    background: #c3c9bd;
  }
  .pitch progress::-webkit-progress-value {
    background: #497e65;
  }
  .pitch .headline {
    padding-top: clamp(18px, 2.7vw, 52px);
    padding-bottom: clamp(18px, 2.2vw, 43px);
  }
  #clock-label {
    font-size: clamp(12px, 1vw, 19px);
    color: var(--muted);
  }
  .pitch .time {
    font-size: clamp(15px, 1.2vw, 24px);
  }
  @media (max-width: 900px) {
    .controls .fine {
      display: none;
    }
    .tools {
      gap: 10px;
    }
    .transport {
      gap: 7px;
    }
    .witness-heading {
      gap: 8px;
    }
  }
  @media (max-width: 680px) {
    main {
      padding: 14px;
    }
    .brand {
      gap: 8px;
    }
    .brand span {
      padding-left: 8px;
    }
    .tools a {
      display: none;
    }
    .tools {
      font-size: 11px;
    }
    .headline {
      padding: 16px 0;
    }
    #arenas {
      height: clamp(330px, 91vw, 540px);
    }
    .pane {
      width: 100%;
      height: 50%;
      padding: 8px 12px;
    }
    .pane.a {
      border: 0;
      border-bottom: 1px solid #82938870;
    }
    .pane.b {
      left: 0;
      top: 50%;
    }
    .pairhead h2 {
      font-size: 18px;
    }
    .run-no {
      font-size: 9px;
    }
    .quantity b {
      font-size: 21px;
    }
    .rooms {
      font-size: 10px;
    }
    .transport button {
      font-size: 11px;
      padding: 6px;
    }
    .primary {
      min-width: 65px;
    }
    #checkpoint {
      display: none;
    }
    .controls {
      gap: 6px;
    }
    .controls label,
    .controls button,
    .controls select {
      font-size: 12px;
    }
    .controls select {
      margin: 0;
      max-width: 165px;
    }
    .witness-heading {
      align-items: baseline;
      flex-wrap: wrap;
    }
    .testimony {
      gap: 10px;
    }
    .answer {
      padding-left: 8px;
    }
    blockquote {
      font-size: 15px;
    }
    details {
      font-size: 12px;
    }
  }
  .guest-tag {
    position: absolute;
    z-index: 1;
    pointer-events: none;
    transform: translate(-50%, -100%);
    background: #f5edcf;
    color: #243029;
    border: 1px solid #a9ae8e;
    border-radius: 3px;
    padding: 0.12em 0.4em;
    font-size: clamp(10px, 0.82vw, 17px);
    font-weight: 650;
    box-shadow: 0 1px 6px #14221e55;
    white-space: nowrap;
  }
  .guest-tag::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4px;
    width: 6px;
    height: 6px;
    background: #f5edcf;
    transform: translateX(-50%) rotate(45deg);
  }
  .trail button {
    border: 0;
    background: transparent;
    padding: 1px 4px 1px 0;
    text-decoration: underline;
    color: #33634e;
    font-size: inherit;
  }
  .slide .transport {
    display: none;
  }
  .slide .method {
    font-size: clamp(13px, 1.08vw, 22px);
    color: var(--muted);
    border-top: 1px solid var(--rule);
    padding-top: 0.65em;
    margin: 1.15em 0 0;
  }
  .slide .quantity b {
    font-size: clamp(26px, 3.05vw, 61px);
  }
  .slide .witness-heading {
    margin-top: clamp(16px, 1.8vw, 34px);
  }
  .interview {
    border-top: 1px solid var(--rule);
    margin-top: 14px;
    padding-top: 12px;
  }
  .interview form {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .interview input {
    font: inherit;
    min-width: 190px;
    border: 1px solid #aeb7a9;
    border-radius: 4px;
    padding: 7px 9px;
    background: #f9f8f1;
    color: var(--ink);
  }
  .interview .trail {
    line-height: 1.4;
  }
  .interview output {
    display: block;
  }
  .interview p {
    margin: 8px 0;
  }
</style>
<main>
  <header class="mast">
    <div class="brand"><b>Side B</b><span>Crowd simulation</span></div>
    <div class="tools">
      <span class="seed-label" id="seed-label">40 guests</span
      ><a class="interactive" href="?room">Listening room</a>
      <a id="to-crew" class="interactive" href="?crew">Plan for this crowd \u2197</a>
    </div>
  </header>
  <section class="headline">
    <h1 id="headline">Where does the crowd go?</h1>
    <p id="caption">
      The DJ moves from West Hall to East Hall. One guest gets the radio call.
    </p>
  </section>
  <div id="arenas" aria-label="Two synchronized 3D venues">
    <canvas
      id="comparison-view"
      aria-label="Select a guest in either run"
    ></canvas>
    <section class="pane a">
      <div class="pairhead">
        <div>
          <div class="run-no">Original run</div>
          <h2>Uninterrupted</h2>
        </div>
        <span class="quantity"><b id="count-a">0</b> in East Hall</span>
      </div>
      <div class="rooms"><span>West Hall</span><span>East Hall</span></div>
    </section>
    <section class="pane b">
      <div class="pairhead">
        <div>
          <div class="run-no">Second run</div>
          <h2 id="hold-label">Four-second hold</h2>
        </div>
        <span class="quantity"><b id="count-b">0</b> in East Hall</span>
      </div>
      <div class="rooms"><span>West Hall</span><span>East Hall</span></div>
    </section>
    <span id="tag-a" class="guest-tag" hidden></span
    ><span id="tag-b" class="guest-tag" hidden></span>
    <div id="loading" role="status">Opening both halls\u2026</div>
  </div>
  <div class="transport">
    <button id="play" class="primary interactive" disabled>Replay</button
    ><span id="clock-label" hidden>Simulation time</span
    ><span class="time" id="clock">0.0 s</span>
    <input
      class="scrub interactive"
      id="seek"
      aria-label="Simulation time"
      type="range"
      min="0"
      max="400"
      value="0"
      step="1"
      disabled
    /><progress id="progress" max="400" value="0" hidden></progress>
    <button class="interactive" id="checkpoint" disabled>Checkpoint</button
    ><button class="interactive" id="end" disabled>Outcome</button
    ><button id="start-pitch" class="primary" hidden>Play film</button>
  </div>
  <div class="controls interactive">
    <label
      >Interrupt
      <select
        id="messenger"
        aria-label="Guest to interrupt"
        disabled
      ></select></label
    ><button id="best" disabled>Largest effect</button
    ><button id="new" disabled>New crowd</button
    ><span class="fine" id="rank-note"></span>
  </div>
  <section aria-label="Guest memory">
    <div class="witness-heading">
      <h2 id="witness-title">Guest memory</h2>
      <label class="interactive"
        >Inspect
        <select id="witness" aria-label="Inspect a guest" disabled></select
      ></label>
    </div>
    <div class="testimony">
      <div class="answer">
        <span class="eyebrow">Original run</span>
        <blockquote id="answer-a">\u2014</blockquote>
      </div>
      <div class="answer">
        <span class="eyebrow">Second run</span>
        <blockquote id="answer-b">\u2014</blockquote>
      </div>
    </div>
    <details class="interactive" id="evidence">
      <summary>Trace the evidence</summary>
      <div class="trail">
        <ol id="trail-a" aria-label="Original evidence trail"></ol>
        <ol id="trail-b" aria-label="Second evidence trail"></ol>
      </div>
      <div id="interview" class="interview" hidden>
        <form id="question-form">
          <label for="question">Question for both runs</label
          ><input
            id="question"
            maxlength="120"
            placeholder="Who told you?"
            required
          /><button>Ask</button>
        </form>
        <p id="question-context" role="status"></p>
        <div class="trail">
          <output id="response-a"></output><output id="response-b"></output>
        </div>
      </div>
    </details>
  </section>
  <p id="method" class="method" hidden></p>
</main>
`;var r=`<style>
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    background: #f1f0e8;
    color: #202d26;
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
  }
  a {
    color: inherit;
  }
  .home {
    max-width: 1940px;
    margin: auto;
    padding: clamp(32px, 4.7vw, 82px) clamp(21px, 4.35vw, 85px) 34px;
  }
  .home-head {
    display: grid;
    grid-template-columns: 1.13fr 1fr;
    gap: 5.7%;
    align-items: end;
    padding-bottom: clamp(25px, 3vw, 52px);
    border-bottom: 1px solid #9ca799;
  }
  .home h1 {
    font-size: clamp(58px, 8.3vw, 155px);
    font-weight: 570;
    line-height: 0.86;
    letter-spacing: -0.078em;
    margin: 0;
  }
  .home-head p {
    margin: 0;
    max-width: 27em;
    font-size: clamp(19px, 2.02vw, 38px);
    line-height: 1.17;
    letter-spacing: -0.034em;
    text-wrap: balance;
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(17px, 2vw, 38px);
    margin-top: clamp(23px, 2.8vw, 49px);
  }
  .card {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .card > a {
    display: block;
    text-decoration: none;
  }
  .card a:focus-visible,
  .home-foot a:focus-visible {
    outline: 3px solid #3b7e5d;
    outline-offset: 4px;
  }
  .card figure {
    margin: 0;
    aspect-ratio: 1.63;
    overflow: hidden;
    background: #37423a;
  }
  .card img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .card h2 {
    font-size: clamp(23px, 2.35vw, 46px);
    line-height: 1.05;
    letter-spacing: -0.058em;
    margin: clamp(15px, 1.5vw, 28px) 0 9px;
    font-weight: 580;
  }
  .card > a:hover h2 {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }
  .card p {
    font-size: clamp(15px, 1.18vw, 23px);
    line-height: 1.41;
    color: #505d53;
    max-width: 35em;
    margin: 0 0 1.4em;
  }
  .card .measure {
    margin-top: auto;
    padding-top: clamp(10px, 1.15vw, 22px);
    border-top: 1px solid #b0b9aa;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 10px;
    row-gap: 3px;
  }
  .measure strong {
    font-size: clamp(23px, 2.36vw, 45px);
    line-height: 1;
    letter-spacing: -0.065em;
    font-variant-numeric: tabular-nums;
    font-weight: 550;
  }
  .measure span {
    font-size: clamp(13px, 1.03vw, 19px);
    line-height: 1.25;
    color: #4c5950;
  }
  .home-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: clamp(28px, 3.3vw, 66px);
    border-top: 1px solid #aab5a6;
    padding-top: 13px;
    font-size: 14px;
    color: #506054;
  }
  .home-foot a {
    text-underline-offset: 4px;
  }
  .deck-brand {
    display: none;
  }
  .deck .home {
    max-width: initial;
    height: 100svh;
    padding: 5.2vh 4.6vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .deck .deck-brand {
    display: block;
    font-weight: 720;
    letter-spacing: -0.065em;
    font-size: 2.25vw;
    line-height: 1;
    margin-bottom: 4vh;
  }
  .deck .home-head {
    padding-bottom: 3.6vh;
  }
  .deck .home h1 {
    font-size: 7.4vw;
  }
  .deck .home-head p {
    font-size: 1.8vw;
  }
  .deck .gallery {
    margin-top: 3.4vh;
    gap: 1.8vw;
  }
  .deck .card figure {
    aspect-ratio: 1.79;
  }
  .deck .card h2 {
    font-size: 2.6vw;
    margin: 2.4vh 0 0.8vh;
  }
  .deck .card p {
    font-size: 1.23vw;
    margin: 0 0 2vh;
  }
  .deck .measure {
    padding-top: 1.8vh;
  }
  .deck .measure strong {
    font-size: 2.45vw;
  }
  .deck .measure span {
    font-size: 1.08vw;
  }
  .deck .home-foot {
    display: none;
  }
  @media (max-width: 850px) {
    .home-head {
      grid-template-columns: 1fr;
      gap: 17px;
    }
    .home-head p {
      max-width: 37em;
    }
    .gallery {
      gap: 17px;
    }
    .card h2 {
      font-size: 24px;
    }
  }
  @media (max-width: 680px) {
    .home {
      padding-top: 34px;
    }
    .gallery {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .card figure {
      aspect-ratio: 1.94;
    }
    .card .measure {
      margin-top: 0;
    }
    .card p {
      margin-bottom: 13px;
    }
    .home h1 {
      font-size: clamp(51px, 12vw, 75px);
    }
    .home-head p {
      font-size: 20px;
    }
    .home-foot {
      align-items: flex-start;
      flex-direction: column;
    }
  }
  @media (max-width: 850px) {
    .deck .home {
      height: auto;
      min-height: 100svh;
      justify-content: flex-start;
      padding: 25px 20px;
    }
    .deck .deck-brand {
      font-size: 23px;
    }
    .deck .home h1 {
      font-size: clamp(46px, 10vw, 76px);
    }
    .deck .home-head p {
      font-size: 20px;
    }
    .deck .card h2 {
      font-size: 25px;
    }
    .deck .card p {
      font-size: 15px;
    }
    .deck .measure strong {
      font-size: 25px;
    }
    .deck .measure span {
      font-size: 14px;
    }
  }
</style>
<main class="home">
  <div class="deck-brand">Side B</div>
  <header class="home-head">
    <h1>NPC Systems</h1>
    <p>
      How characters share information, coordinate work and search with
      incomplete knowledge.
    </p>
  </header>
  <section
    class="gallery"
    id="gallery"
    aria-label="Three playable NPC systems"
  ></section>
  <footer class="home-foot">
    <span>Built and captured in the Side B simulation.</span
    ><a href="?deck">Open pitch slide \u2197</a>
  </footer>
</main>
`;var p=`<style>
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    background: #f1f0e8;
    color: #202c26;
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
  }
  button,
  select,
  input {
    font: inherit;
    color: inherit;
  }
  button,
  a,
  select,
  input {
    touch-action: manipulation;
  }
  button {
    cursor: pointer;
  }
  button:disabled {
    cursor: default;
    opacity: 0.5;
  }
  [hidden] {
    display: none !important;
  }
  :focus-visible {
    outline: 3px solid #267b69;
    outline-offset: 3px;
  }
  .lab {
    max-width: 1950px;
    margin: 0 auto;
    padding: clamp(23px, 3vw, 53px) clamp(18px, 3.6vw, 70px) 32px;
  }
  .lab-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 30px;
    margin: 0 0 clamp(20px, 2.4vw, 40px);
  }
  .lab-head h1 {
    font-size: clamp(36px, 4.65vw, 88px);
    letter-spacing: -0.072em;
    line-height: 0.98;
    font-weight: 600;
    margin: 0;
  }
  .lab-head p {
    max-width: 34em;
    font-size: clamp(15px, 1.3vw, 25px);
    line-height: 1.37;
    color: #4f5a51;
    margin: 11px 0 0;
  }
  .lab-head a,
  .lab-side a {
    color: #355a49;
    text-underline-offset: 3px;
    font-size: 0.91rem;
  }
  .lab-grid {
    display: grid;
    grid-template-columns: minmax(0, 2.2fr) minmax(270px, 1fr);
    gap: clamp(23px, 2.8vw, 55px);
    align-items: start;
  }
  .lab-view {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1.9;
    background: #343b36;
  }
  .lab-view canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  .loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    background: #242b27;
    color: #fff;
  }
  .live-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    background: linear-gradient(transparent, #171b19df);
    padding: 30px 3% 2%;
    color: #faf6e9;
    font-size: clamp(13px, 1.05vw, 21px);
  }
  .live-caption strong {
    font-weight: 550;
  }
  .live-caption time,
  .timescale {
    font-variant-numeric: tabular-nums;
  }
  .transport-lab {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #c0c4b7;
  }
  .transport-lab input {
    min-width: 40px;
    flex: 1;
    accent-color: #42654e;
  }
  .lab button {
    background: transparent;
    border: 1px solid #a6ac9e;
    border-radius: 4px;
    padding: 8px 13px;
    font-size: 14px;
    line-height: 1.2;
  }
  .lab button:hover:enabled {
    background: #e2e6d9;
  }
  .lab button.main-action {
    background: #244735;
    color: #fff;
    border-color: #244735;
    font-weight: 580;
  }
  .lab button.main-action:hover:enabled {
    background: #355740;
  }
  .lab-side {
    border-top: 2px solid #33473a;
    padding-top: clamp(13px, 1.5vw, 26px);
  }
  .lab-side h2 {
    font-size: clamp(23px, 2vw, 40px);
    line-height: 1.02;
    letter-spacing: -0.054em;
    font-weight: 570;
    margin: 0 0 14px;
  }
  .lab-side h3,
  .below h3 {
    font-size: clamp(16px, 1.12vw, 23px);
    margin: 0 0 12px;
    letter-spacing: -0.025em;
  }
  .fields {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 10px;
  }
  .fields label {
    font-size: 13px;
    display: grid;
    gap: 5px;
    color: #526055;
  }
  .fields select {
    background: #faf9f1;
    border: 1px solid #a6ad9e;
    padding: 7px 6px;
    border-radius: 3px;
    font-size: 14px;
  }
  .lab-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 13px 0;
  }
  .result {
    margin: 17px 0;
    padding: 15px 0;
    border-block: 1px solid #bcc2b4;
  }
  .result .metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 12px;
  }
  .metric strong {
    display: block;
    letter-spacing: -0.055em;
    font-size: clamp(24px, 2.48vw, 49px);
    font-weight: 560;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }
  .metric span,
  .minor {
    font-size: clamp(12px, 0.96vw, 17px);
    color: #59655a;
    line-height: 1.4;
  }
  .result p,
  .notes {
    font-size: clamp(14px, 1.09vw, 21px);
    line-height: 1.43;
    margin: 11px 0 0;
  }
  .below {
    margin-top: 17px;
  }
  .below h3 {
    margin-bottom: 8px;
  }
  .report-row {
    display: grid;
    grid-template-columns: 64px 1fr;
    align-items: center;
    gap: 9px;
    padding: 4px 0;
    font-size: 13px;
  }
  .report-row b {
    font-weight: 560;
  }
  .work-track {
    position: relative;
    height: 18px;
    background: #e2e3d9;
    border-radius: 2px;
  }
  .work-track i,
  .work-track em {
    position: absolute;
    height: 100%;
    min-width: 2px;
  }
  .work-track i {
    background: #7b9881;
    border: 1px solid #f1f0e8;
    border-radius: 2px;
  }
  .work-track .away {
    background: repeating-linear-gradient(
      115deg,
      #b67e62,
      #b67e62 3px,
      #e2bba2 3px,
      #e2bba2 6px
    );
  }
  .work-track em {
    border-left: 2px solid #202e25;
    z-index: 1;
    width: 0;
  }
  .prob {
    display: grid;
    grid-template-columns: 85px 1fr 39px;
    align-items: center;
    gap: 9px;
    margin: 10px 0;
    font-size: 14px;
  }
  .prob i {
    background: #e0e2d7;
    height: 5px;
  }
  .prob b {
    display: block;
    background: #63836d;
    height: 100%;
  }
  .prob span:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .proof-note {
    color: #5b655c;
    margin: 7px 0 0;
    font-size: 13px;
    line-height: 1.5;
  }
  .evidence-list {
    list-style: none;
    padding: 0;
    margin: 6px 0;
  }
  .evidence-list li {
    display: flex;
    align-items: baseline;
    gap: 10px;
    border-top: 1px solid #d6d8cd;
    padding: 7px 0;
    line-height: 1.34;
    font-size: 14px;
  }
  .evidence-list time {
    white-space: nowrap;
    color: #52735f;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .film .lab {
    max-width: none;
    padding: 4.5vh 4vw;
  }
  .film .lab-head {
    margin-bottom: 4vh;
  }
  .film .lab-view {
    aspect-ratio: 1.81;
  }
  .film .lab-head h1 {
    font-size: 5.4vw;
  }
  .film .lab-head p {
    font-size: 1.5vw;
    max-width: 62em;
  }
  .film .lab-grid {
    grid-template-columns: 2.2fr 1fr;
    gap: 2.65vw;
  }
  .film .interactive {
    display: none;
  }
  .film .below,
  .film .lab-side {
    margin-top: 0;
  }
  .film .below {
    margin-top: 2.1vh;
  }
  .film .result {
    margin-top: 0;
  }
  .film .report-row,
  .film .prob,
  .film .evidence-list li {
    font-size: 1.1vw;
  }
  .film .work-track {
    height: 1.45vw;
  }
  .film .report-row {
    grid-template-columns: 4.4vw 1fr;
  }
  .film .prob {
    grid-template-columns: 5.6vw 1fr 3.2vw;
  }
  .film .evidence-list time,
  .film .proof-note {
    font-size: 0.93vw;
  }
  @media (max-width: 850px) {
    .lab-grid {
      grid-template-columns: 1fr;
    }
    .lab-side {
      max-width: 100%;
    }
    .lab-head {
      align-items: flex-start;
    }
    .lab-head > a {
      white-space: nowrap;
    }
    .lab-view {
      aspect-ratio: 1.7;
    }
    .lab-side .result {
      max-width: 650px;
    }
  }
  @media (max-width: 550px) {
    .lab-head {
      display: block;
    }
    .lab-head > a {
      display: inline-block;
      margin-top: 9px;
    }
    .lab {
      padding-top: 23px;
    }
    .lab-view {
      aspect-ratio: 1.5;
    }
    .lab-grid {
      gap: 18px;
    }
    .live-caption {
      font-size: 12px;
      padding: 25px 9px 8px;
    }
    .transport-lab {
      gap: 7px;
    }
    .lab button {
      font-size: 13px;
      padding: 8px;
    }
    .fields select {
      max-width: 100%;
    }
  }
  .film .lab {
    padding-top: 3.8vh;
  }
  .film .lab-head {
    margin-bottom: 2.8vh;
  }
  .film .lab-head h1 {
    font-size: 4.6vw;
  }
  .film .lab-head p {
    font-size: 1.35vw;
  }
  .film .lab-view {
    aspect-ratio: 2.05;
  }
  .film .report-row {
    padding: 2px 0;
  }
  .film .below {
    margin-top: 1.5vh;
  }
  @media (max-width: 850px) {
    .film .lab-grid {
      grid-template-columns: 1fr;
    }
    .film .lab-head h1 {
      font-size: clamp(34px, 6vw, 52px);
    }
    .film .lab-head p {
      font-size: 16px;
    }
    .film .prob,
    .film .report-row,
    .film .evidence-list li {
      font-size: 14px;
    }
    .film .report-row {
      grid-template-columns: 64px 1fr;
    }
    .film .prob {
      grid-template-columns: 85px 1fr 39px;
    }
    .film .evidence-list time,
    .film .proof-note {
      font-size: 13px;
    }
    .film .work-track {
      height: 18px;
    }
  }
</style>
<main class="lab">
  <header class="lab-head">
    <div>
      <h1 id="lab-title"></h1>
      <p id="premise"></p>
    </div>
    <a id="related" class="interactive" hidden></a>
  </header>
  <div class="lab-grid">
    <div>
      <div class="lab-view">
        <canvas id="world" aria-label="Live 3D simulation"></canvas>
        <div class="live-caption">
          <strong id="scene-caption"></strong><time id="time"></time>
        </div>
        <div class="loading" id="loading" role="status">Opening the venue\u2026</div>
      </div>
      <div class="transport-lab interactive">
        <button id="play">Play</button
        ><input
          type="range"
          id="scrub"
          min="0"
          step="1"
          aria-label="Simulation time"
        /><button id="finish">Outcome</button>
      </div>
      <section class="below" id="under"></section>
    </div>
    <aside class="lab-side">
      <h2 id="experiment"></h2>
      <div class="fields interactive" id="fields"></div>
      <div class="lab-actions interactive" id="actions"></div>
      <div id="result" class="result"></div>
      <div id="details"></div>
    </aside>
  </div>
</main>
`;var s=`<style>
  .npc-nav {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin: 0 auto;
    padding: 0 clamp(18px, 3.6vw, 72px);
    width: 100%;
    max-width: 2010px;
    min-height: 54px;
    border-bottom: 1px solid #c6c8bc;
    background: #f1f0e8;
    color: #28352e;
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.15;
  }
  .npc-nav div {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 34px);
    flex-wrap: wrap;
  }
  .npc-nav a {
    color: inherit;
    text-decoration: none;
    font-size: 13px;
    white-space: nowrap;
  }
  .npc-nav .npc-wordmark {
    font-size: 23px;
    font-weight: 750;
    letter-spacing: -0.065em;
  }
  .npc-nav a[aria-current] {
    font-weight: 730;
  }
  .npc-nav a:hover,
  .npc-nav a:focus-visible {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  body:has(.stage) > .npc-nav {
    align-self: end;
  }
  body:has(.stage):has(> .npc-nav) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 670px) {
    .npc-nav {
      gap: 10px;
      padding: 12px 16px;
      align-items: flex-start;
    }
    .npc-nav .npc-wordmark {
      font-size: 19px;
    }
    .npc-nav div {
      justify-content: flex-end;
      column-gap: 13px;
      row-gap: 8px;
    }
    .npc-nav a {
      font-size: 11px;
    }
  }
</style>
`;var e=new URLSearchParams(location.search),i=e.has("crew")?"crew":e.has("perception")?"perception":e.has("room")||e.has("screening")?"room":e.has("home")||e.has("deck")?"home":["crowd","seed","pitch","slide"].some(t=>e.has(t))?"social":"home",g=["screening","pitch","slide","deck","film"].some(t=>e.has(t));document.title={home:"NPC Systems",social:"Social memory",room:"Listening room",crew:"Crew coordination",perception:"Perception & search"}[i]+" \xB7 Side B";document.querySelector("#app").outerHTML=i==="room"?n:i==="social"?o:i==="home"?r:p;g||(document.head.insertAdjacentHTML("beforeend",s),document.body.prepend(a(i==="room"?"social":i)));e.has("deck")&&document.body.classList.add("deck");e.has("film")&&document.body.classList.add("film");i==="room"?import("./chunks/play-6NHPEFI6.js"):i==="social"?import("./chunks/app-63ILRMD5.js"):i==="crew"?import("./chunks/app-43GMX5AZ.js"):i==="perception"?import("./chunks/app-643QPDU3.js"):import("./chunks/home-CRIAB5DB.js");
