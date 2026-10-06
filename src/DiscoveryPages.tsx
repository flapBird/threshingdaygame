import React from "react";
import { dragons, RULE_VERSION } from "./trial";
import { SOURCE_FAQ, SOURCE_REDDIT, SOURCE_SCENES } from "./content";

export function DiscoveryLinks() {
  return (
    <nav className="discovery-links" aria-label="More dragon adventures">
      <a href="/dragonkind-black-dragon/">
        How to get a black dragon in Dragonkind →
      </a>
      <a href="/fourth-wing-dragon-quiz/">Take the Fourth Wing dragon quiz →</a>
    </nav>
  );
}

export function BlackDragonPage() {
  return (
    <main className="editorial-page discovery-page">
      <div className="breadcrumbs">
        <a href="/guides/">Guides</a>
        <span>/</span>
        <span>Black dragons</span>
      </div>
      <header className="article-header">
        <p className="eyebrow">Dragonkind · Facts & player reports</p>
        <h1>How to Get a Black Dragon in Dragonkind</h1>
        <p className="article-intro">
          A black dragon is possible, but we have no verified answer sequence
          that guarantees one. Here is what is confirmed, what players report,
          and how to approach your next attempt.
        </p>
        <div className="article-meta">
          <span>Checked October 5, 2026</span>
          <span>No guaranteed answers</span>
        </div>
      </header>
      <div className="article-layout">
        <article>
          <section id="confirmed">
            <h2>Can you get a black dragon?</h2>
            <p>
              Yes. Rebecca Yarros’s FAQ confirms that every dragon color and
              tail type is possible. It does not provide color probabilities or
              an answer key. That confirms the possibility of a black bond,
              without establishing how to force one.
            </p>
            <a
              className="source-link"
              href={SOURCE_FAQ}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official source · Rebecca Yarros’s FAQ ↗
            </a>
          </section>
          <section id="reports">
            <h2>What player reports actually tell us</h2>
            <p>
              The community’s third bonding megathread says there is no specific
              route to black or blue dragons and describes outcomes as luck and
              randomness. That is community guidance, not an official
              explanation of the matching code.
            </p>
            <p>
              A successful route is useful as an account of one attempt. It
              cannot establish that the same choices will produce the same
              dragon for everyone.
            </p>
            <a
              className="source-link"
              href={SOURCE_REDDIT}
              target="_blank"
              rel="noopener noreferrer"
            >
              Player reports · Bonding megathread ↗
            </a>
          </section>
          <section id="theories">
            <h2>Community theories: answers, devices and hidden factors</h2>
            <p>
              The earlier discussion includes a theory about low phone battery
              affecting black-dragon encounters. We have no official evidence
              for that claim. Changing a device setting on the strength of an
              anecdote is not a verified strategy.
            </p>
            <p>
              Before treating any “black dragon answers” list as reliable, look
              for the complete sequence, its outcome, and reports from people
              who repeated it. Even matching reports cannot isolate a hidden
              factor or establish a guarantee.
            </p>
            <a
              className="source-link"
              href={SOURCE_SCENES}
              target="_blank"
              rel="noopener noreferrer"
            >
              Community discussion · Contains game scene spoilers ↗
            </a>
          </section>
          <section id="black-blue">
            <h2>Black vs blue dragons: is one easier to get?</h2>
            <p>
              The official FAQ allows both colors, but supplies no comparison of
              their chances. Screenshots and voluntary polls do not represent
              every attempt: unusual results may be more likely to get shared.
            </p>
            <p>
              We therefore do not assign official rarity percentages to black or
              blue dragons. For a broader look at colors and shared routes, read
              our{" "}
              <a href="/guides/black-blue-dragons/">
                black and blue dragon guide
              </a>
              .
            </p>
          </section>
          <section id="retry">
            <h2>What to do after a failed attempt</h2>
            <p>
              The official FAQ says you can retry after a few hours and keep
              attempting until you bond. Use the wait shown in your own game.
              That statement does not establish a way to replace an existing
              bond with a black dragon.
            </p>
            <p>
              Our{" "}
              <a href="/guides/retry-cooldown/#timer">
                device-local retry reminder
              </a>{" "}
              helps track the time you enter. It cannot shorten the official
              wait or access your account.
            </p>
            <a
              className="source-link"
              href={SOURCE_FAQ}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official source · Retry guidance ↗
            </a>
          </section>
          <section className="article-next" id="practice">
            <p className="eyebrow">While you wait</p>
            <h2>Practice making choices in an original fan story.</h2>
            <p>
              Our eight-choice trial offers instant replay and six original
              companions, including Vesper, a black dragon whose defining trait
              is resolve. It is a separate story with its own visible rules; it
              does not rehearse official questions or improve your official
              odds.
            </p>
            <a href="/play/#play-card" className="button primary">
              Play the free fan trial →
            </a>
            <p>
              <a
                href="https://dragonkind.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open official Dragonkind ↗
              </a>
            </p>
          </section>
        </article>
        <aside>
          <p className="eyebrow">In this guide</p>
          <a href="#confirmed">Confirmed possibilities</a>
          <a href="#reports">Player reports</a>
          <a href="#theories">Community theories</a>
          <a href="#black-blue">Black vs blue</a>
          <a href="#retry">Retry advice</a>
          <a href="#practice">Fan-story practice</a>
        </aside>
      </div>
    </main>
  );
}

export function FourthWingQuizPage() {
  return (
    <main className="editorial-page discovery-page quiz-landing">
      <header className="quiz-landing-hero">
        <div>
          <p className="eyebrow">An independent fan adventure</p>
          <h1>Fourth Wing Dragon Quiz — Which Dragon Would Choose You?</h1>
          <p className="article-intro">
            Would you cross first, offer a hand, or find your own way? Take
            eight story choices and meet the original dragon companion that
            reflects your strongest trait.
          </p>
          <a href="/play/#play-card" className="button primary">
            Find my dragon →
          </a>
          <p className="quiz-promise">
            8 choices · No signup · Instant replay · Free dragon card
          </p>
          <p className="fan-note">
            Inspired by the appeal of a dragon choosing its rider. This fan quiz
            is not affiliated with Rebecca Yarros or the official Dragonkind
            game.
          </p>
        </div>
        <img
          src="/images/vesper.webp"
          alt="Vesper, our original black dragon companion"
          width="800"
          height="1000"
        />
      </header>
      <section>
        <h2>Your choices shape the bond.</h2>
        <p>
          This is a story quiz, so you do not need to remember book trivia.
          Choose the sunken way, lantern grove or windward ridge. Discover
          different encounters and see your earlier decisions shape later
          scenes. Each decision explores insight, loyalty, freedom, courage,
          resolve or curiosity. Your leading trait chooses your companion; your
          two leading traits determine your bond-rarity label.
        </p>
        <p>
          The quiz uses the same original eight-choice engine as Threshing Day
          Game. There is no account, timer or paid result. You can go back to
          reconsider a decision, save the finished card, and replay immediately.
        </p>
      </section>
      <section>
        <h2>Six original dragons to discover</h2>
        <p>
          Your result is one of our own fan companions, rather than a canonical
          character match. Every companion is reachable. Dragon color alone does
          not determine rarity.
        </p>
        <div className="quiz-companions">
          {dragons.map((dragon) => (
            <a
              href={`/?dragon=${dragon.id}&v=${RULE_VERSION}#play-card`}
              key={dragon.id}
            >
              <strong>{dragon.name}</strong>
              <span>
                {dragon.color} · {dragon.trait}
              </span>
            </a>
          ))}
        </div>
      </section>
      <section>
        <h2>A dragon card worth sharing</h2>
        <p>
          Your result reveals a portrait, an oath, your leading traits and a
          bond tier: Common, Uncommon, Rare, Epic or Legendary. The tier comes
          from the proportion of all possible answer paths with your leading
          trait pair. It is not a percentage of real riders or a claim about
          official dragon rarity.
        </p>
        <p>
          Save your PNG card or share a link so a friend can see the same
          companion and trait pair, then discover their own.{" "}
          <a href="/sources/#bond-rarity">Read the rarity method</a> or explore
          the <a href="/#dragon-wall">public dragon wall</a>. Publishing to the
          wall is optional.
        </p>
      </section>
      <section>
        <h2>Is this the official Fourth Wing dragon-bonding game?</h2>
        <p>
          No. For the official experience, visit{" "}
          <a
            href="https://dragonkind.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dragonkind ↗
          </a>
          . A result here does not create or change an official bond. Our story,
          names, artwork and matching rules are original fan work.
        </p>
        <h2>Can I get a black dragon?</h2>
        <p>
          Yes—Vesper is one of this quiz’s six outcomes. In our rules, Vesper
          matches resolve. If you mean the official game, see{" "}
          <a href="/dragonkind-black-dragon/">
            how to get a black dragon in Dragonkind
          </a>{" "}
          for confirmed possibilities and the limits of shared answer routes.
        </p>
        <h2>Will the same answers give the same result?</h2>
        <p>
          Yes. Under the same rules, the same eight choices always produce the
          same companion, traits and rarity. Try a different approach on your
          next journey to explore another bond.
        </p>
      </section>
      <div className="article-next">
        <h2>Who is waiting beyond the bridge?</h2>
        <a href="/play/#play-card" className="button primary">
          Take the free dragon quiz →
        </a>
      </div>
    </main>
  );
}
