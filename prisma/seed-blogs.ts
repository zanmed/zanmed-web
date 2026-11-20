/**
 * Blog seed — second batch, mining the remainder of the Google Trends data.
 * ---------------------------------------------------------------------------
 * content is HTML (Tiptap/editor.getHTML() format) — see seed-blogs-trends.ts
 * for the full explanation. Same rule applies here: h2/h3/p/ul/ol/li/
 * blockquote/a/strong/em, no Markdown.
 *
 * Deliberately NOT covered here (see chat for reasoning):
 *  - "laptop stand", "laptop charger" / "type c laptop charger" — real
 *    search volume, but we stock neither product, so no post was forced.
 *  - "how to set password for laptop", "how to connect phone to laptop",
 *    "how to clean laptop screen" — small single-answer how-tos; better
 *    added as sections to the existing how-to hub post than as new,
 *    competing/cannibalizing URLs.
 *  - "laptop stickers", "microsoft store", "ec uk laptops" — low/ambiguous
 *    commercial intent.
 *
 * Routes: Product -> /products/:slug | Category -> /products?category=:slug
 *         Brand -> /products?brand=:slug | Collection -> /products?collection=:slug
 */

import { BlogStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const unsplash = (id: string, w = 1600, h = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

interface BlogSeed {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  publishedAt: Date;
}

function blogSeeds(): BlogSeed[] {
  return [
    // 1 -----------------------------------------------------------------
    {
      slug: "hp-elitebook-840-every-generation-compared",
      title: "HP EliteBook 840: Comparing Every Generation We Stock",
      excerpt:
        "'HP EliteBook 840' is a specific, high-intent search we see often. We stock five different generations of it — here's how to tell them apart and which one actually fits you.",
      metaTitle: "HP EliteBook 840 — All Generations Compared (G4 to G10)",
      metaDescription:
        "Confused by the different HP EliteBook 840 generations? A clear comparison of the G4, G5, G8, G9 and G10 models we stock, and who each one suits.",
      coverImage: unsplash("photo-1588200908342-23b585c03e26"),
      tags: ["hp", "elitebook-840", "buying-guide"],
      publishedAt: daysAgo(18),
      content: `<p>"HP EliteBook 840" is one of the more specific, high-intent searches we see — people who already know they want this particular line, but aren't sure which generation to buy. Good news: we stock five different generations of it, spanning a wide range of processors and prices. Here's how to actually tell them apart.</p>

<h2>Why "generation" matters more than the model number alone</h2>
<p>Every EliteBook 840 shares the same core design philosophy — a durable 14-inch business clamshell with a strong keyboard — but the internal hardware changes significantly across generations. A newer generation at a lower RAM configuration can still outperform an older generation with more RAM, because processor efficiency improves substantially between generations.</p>

<h2>The generations we currently stock</h2>
<ul>
<li><strong><a href="/products/hp-elitebook-840-g4-i7-8gb-256gb-touch">EliteBook 840 G4</a></strong> — 7th Gen Intel Core i7, 8GB RAM, 256GB SSD, with a touchscreen. Our most affordable 840, and the only one in our range with touch input on this specific model.</li>
<li><strong><a href="/products/hp-elitebook-840-g5-i5-8gb-256gb">EliteBook 840 G5</a></strong> — 8th Gen Intel Core i5, 8GB RAM, 256GB SSD. A dependable, no-frills step up in processor generation from the G4.</li>
<li><strong><a href="/products/hp-elitebook-840-g8-i7-16gb-512gb">EliteBook 840 G8</a></strong> — 11th Gen Intel Core i7, 16GB RAM, 512GB SSD. A significant jump in both processor generation and specs — real headroom for heavy multitasking.</li>
<li><strong><a href="/products/hp-elitebook-840-g9-i7-16gb-512gb">EliteBook 840 G9</a></strong> — 12th Gen Intel Core i7, 16GB RAM, 512GB SSD. One of the best-equipped 840s in our range.</li>
<li><strong><a href="/products/hp-elitebook-840-g10-i5-8gb-256gb">EliteBook 840 G10</a></strong> — 13th Gen Intel Core i5, 8GB RAM, 256GB SSD. The newest processor generation we stock in this line, even though RAM is lower than the G8/G9 — a genuinely current-generation chip at a more modest spec elsewhere.</li>
</ul>

<h2>So which one should you actually buy?</h2>
<blockquote>If you want the newest processor generation at the lowest price, the G10 is a strong pick despite its lower RAM. If you want maximum multitasking headroom regardless of generation, the G8 or G9 are the stronger choice.</blockquote>
<ul>
<li><strong>Tightest budget, basic office work</strong> → the G4 or G5.</li>
<li><strong>Best balance of generation and memory</strong> → the G8 or G9.</li>
<li><strong>Newest chip, don't need 16GB</strong> → the G10.</li>
<li><strong>Want a touchscreen specifically</strong> → the G4 is the one with touch in our current range.</li>
</ul>

<p>Browse the full <a href="/products?brand=hp">HP range</a> if none of these five quite fit, or message us on WhatsApp — tell us your budget and what you use the laptop for, and we'll point you to the right generation rather than just the newest one.</p>`,
    },

    // 2 -----------------------------------------------------------------
    {
      slug: "samsung-laptops-kenya-where-we-stand",
      title: "Looking for a Samsung Laptop in Kenya? Here's Where We Stand",
      excerpt:
        "Samsung laptop searches are real and consistent — but we don't have Samsung stock yet. Here's an honest update, and what we'd suggest in the meantime.",
      metaTitle: "Samsung Laptops in Kenya — Current Availability",
      metaDescription:
        "Looking for a Samsung Galaxy Book or Samsung laptop in Kenya? An honest note on our current stock, and comparable alternatives available now.",
      coverImage: unsplash("photo-1496181133206-80ce9b88a853"),
      tags: ["samsung", "availability", "kenya"],
      publishedAt: daysAgo(20),
      content: `<p>Samsung is consistently searched alongside the other major laptop brands in Kenya, and it's one of our five core brands. So we want to be upfront: <strong>we don't currently have Samsung laptops in stock.</strong> Rather than let that search go unanswered, here's where things actually stand, and what we'd point you toward in the meantime.</p>

<h2>What Samsung's laptop lineup actually offers</h2>
<p>Samsung's Galaxy Book range is generally aimed at people who want a thin, light Windows laptop with a strong display — Samsung's background in screens shows up here — often paired tightly with a Samsung phone for file-sharing and continuity features similar to what Apple offers between a MacBook and iPhone.</p>

<h2>What we'd suggest right now</h2>
<p>If a slim, light, well-built ultrabook is what's drawing you to Samsung specifically, our <a href="/products/lenovo-thinkpad-x1-carbon-i7-8gb-256gb-touch">ThinkPad X1 Carbon</a> is one of the lightest business laptop chassis available today, with a touchscreen option. If display quality and portability are the priority above all else, our <a href="/products/macbook-air-m3-2024-16gb-1tb-15in">MacBook Air M3</a> is the strongest all-rounder we currently stock, albeit in a different ecosystem than Samsung's Android-centric continuity features.</p>

<blockquote>If you specifically need Samsung for compatibility with a Samsung phone or tablet, tell us — we can look into sourcing a specific model on request rather than leave you without an option.</blockquote>

<p>Check our <a href="/products?brand=samsung">Samsung brand page</a> periodically — we'll update it the moment stock becomes available. In the meantime, browse our full <a href="/products?category=laptops">laptop range</a>, or message us on WhatsApp with what drew you to Samsung specifically and we'll find the closest match in what we do carry.</p>`,
    },

    // 3 -----------------------------------------------------------------
    {
      slug: "asus-acer-laptops-kenya-alternatives",
      title:
        "Looking for an Asus or Acer Laptop? Here's What We'd Recommend Instead",
      excerpt:
        "Asus and Acer are both frequently searched in Kenya, but we don't carry either brand. Here's an honest redirect based on what you're actually after.",
      metaTitle: "Asus & Acer Laptop Alternatives in Kenya",
      metaDescription:
        "Searching for an Asus or Acer laptop in Kenya? We don't stock either brand — here's what to look for instead from our actual lineup.",
      coverImage: unsplash("photo-1525547719571-a2d4ac8945e2"),
      tags: ["asus", "acer", "alternatives", "buying-guide"],
      publishedAt: daysAgo(22),
      content: `<p>Asus and Acer both show up regularly in laptop searches in Kenya — but to be upfront, <strong>neither is a brand we carry.</strong> Our current lineup focuses on HP, Dell, Lenovo, Apple and Samsung. Rather than leave that search unanswered, here's an honest breakdown of what people usually want when they search for these two brands, and the closest match in what we actually stock.</p>

<h2>If you're after Asus for lightweight, everyday use</h2>
<p>Asus is often searched by people wanting a slim, affordable everyday laptop. Our <a href="/products/hp-probook-430-g7-i5-8gb-256gb">HP ProBook 430 G7</a> covers similar ground — a compact 13-inch chassis built for portability — with the added benefit of business-grade durability testing that most consumer-focused brands don't go through.</p>

<h2>If you're after Acer for budget pricing</h2>
<p>Acer is frequently searched by budget-conscious buyers. Our <a href="/products/hp-15-amd-a6-4gb-512gb">HP 15 (AMD A6)</a> and <a href="/products/dell-latitude-5290-i5-8gb-256gb">Dell Latitude 5290</a> both sit in a similar budget bracket, with the advantage of being business-line machines rather than consumer-grade — generally sturdier for the same money.</p>

<h2>If you're after Asus or Acer specifically for gaming</h2>
<p>Both brands make gaming laptops with dedicated graphics cards. We don't stock dedicated gaming laptops at all right now — see our honest take in our <a href="/blogs/best-cheap-gaming-laptops-kenya-honest-guide">gaming laptops guide</a> for the closest workstation-class alternatives we do carry.</p>

<blockquote>We'd rather tell you plainly that we don't carry a brand than quietly substitute something and hope you don't notice the difference.</blockquote>

<p>Browse our full <a href="/products?category=laptops">laptop range</a> across the five brands we do stock, or message us on WhatsApp with your budget and use case — we'll match you to the closest real alternative rather than a generic suggestion.</p>`,
    },

    // 4 -----------------------------------------------------------------
    {
      slug: "best-budget-laptops-kenya",
      title: "Best Budget Laptops in Kenya",
      excerpt:
        "'Best budget laptops' has seen a sharp rise in searches recently. Here are our actual top picks under budget pricing, not a generic list.",
      metaTitle: "Best Budget Laptops in Kenya — Our Top Picks",
      metaDescription:
        "Looking for the best budget laptop in Kenya? Specific picks from our current stock, with real specs and prices, not a generic roundup.",
      coverImage: unsplash("photo-1525547719571-a2d4ac8945e2"),
      tags: ["budget", "buying-guide", "kenya"],
      publishedAt: daysAgo(24),
      content: `<p>"Best budget laptops" has climbed sharply as a search term recently. Most "best budget laptop" lists online are generic and not tied to actual available stock — so here's a real list, pulled directly from our <a href="/products?collection=budget-friendly">Budget Friendly collection</a>, with honest notes on who each one suits.</p>

<h2>For the absolute tightest budget</h2>
<p>The <a href="/products/hp-15-amd-a6-4gb-512gb">HP 15 (AMD A6)</a> is about as affordable as a usable laptop gets — 4GB RAM is enough for browsing, documents and basic tasks, and the 512GB drive is unusually generous for this price tier.</p>

<h2>For a step up in reliability without a big price jump</h2>
<p>The <a href="/products/dell-latitude-5290-i5-8gb-256gb">Dell Latitude 5290</a> brings an Intel Core i5 and an SSD, at a business-grade build quality most consumer laptops at this price don't match.</p>

<h2>For touch input on a budget</h2>
<p>The <a href="/products/hp-elitebook-840-g4-i7-8gb-256gb-touch">HP EliteBook 840 G4</a> is one of the few touchscreen options at this price point, and still carries HP's EliteBook-grade build quality despite its age.</p>

<h2>For the newest processor generation at a budget price</h2>
<p>The <a href="/products/hp-elitebook-840-g10-i5-8gb-256gb">HP EliteBook 840 G10</a> runs a genuinely current 13th Gen processor, trading some RAM for a much newer chip than most budget options.</p>

<h2>What "budget" should actually mean</h2>
<blockquote>A budget laptop doesn't have to mean a bad laptop — it means prioritizing an SSD and a decent processor generation over extras like touchscreens, high RAM or premium materials.</blockquote>
<ul>
<li>Always check for an SSD over a traditional hard drive — it matters more than almost any other spec at this price point.</li>
<li>8GB RAM is comfortable; 4GB is workable for light use only.</li>
<li>A refurbished business laptop at this price is usually better built than an equivalent brand-new consumer laptop.</li>
</ul>

<p>Browse the full <a href="/products?collection=budget-friendly">Budget Friendly collection</a>, or message us your exact budget on WhatsApp and we'll confirm what's currently available in that range.</p>`,
    },

    // 5 -----------------------------------------------------------------
    {
      slug: "how-to-install-whatsapp-on-your-laptop",
      title:
        "How to Install WhatsApp on Your Laptop (And Order From Us Right There)",
      excerpt:
        "'How to install WhatsApp on laptop' is one of the fastest-growing laptop searches we see. Here's how to do it — and why it's exactly how our ordering process works.",
      metaTitle: "How to Install WhatsApp on Your Laptop — Step by Step",
      metaDescription:
        "A simple guide to installing WhatsApp on your Windows or Mac laptop, including both the desktop app and browser version.",
      coverImage: unsplash("photo-1611186871348-b1ce696e52c9"),
      tags: ["how-to", "whatsapp", "guide"],
      publishedAt: daysAgo(26),
      content: `<p>"How to install WhatsApp on laptop" has grown sharply as a search recently — and it happens to be directly useful to how ordering works on our site, since every order here goes through WhatsApp. Here's exactly how to set it up.</p>

<h2>Option 1: WhatsApp Web (no installation needed)</h2>
<ol>
<li>On your laptop, open a browser and go to <strong>web.whatsapp.com</strong>.</li>
<li>On your phone, open WhatsApp, tap the menu (three dots on Android, or <em>Settings</em> on iPhone), and select <strong>Linked Devices</strong>.</li>
<li>Tap <strong>Link a Device</strong> and scan the QR code shown on your laptop screen.</li>
</ol>
<p>Your laptop now mirrors your phone's WhatsApp — messages sync both ways, and it stays linked even if your phone is in another room, as long as it has an internet connection periodically.</p>

<h2>Option 2: The WhatsApp Desktop app</h2>
<ol>
<li>On Windows, download WhatsApp from the <strong>Microsoft Store</strong> or from whatsapp.com directly.</li>
<li>On a Mac, download it from the <strong>Mac App Store</strong> or whatsapp.com.</li>
<li>Open the app and scan the QR code with your phone's WhatsApp the same way as the web version.</li>
</ol>
<p>The desktop app works almost identically to WhatsApp Web, but opens as its own application rather than a browser tab — useful if you keep WhatsApp open constantly.</p>

<h2>Why this is useful beyond messaging friends</h2>
<blockquote>Every order on our site is placed through WhatsApp — when you browse a product and click to order, it opens a pre-filled WhatsApp message to our team. Having WhatsApp set up on your laptop means you can browse our full catalog and place that order without reaching for your phone at all.</blockquote>

<p>Browse <a href="/products?category=laptops">our laptops</a> or any other category, and once you've got WhatsApp set up on your laptop, ordering is a single click away.</p>`,
    },

    // 6 -----------------------------------------------------------------
    {
      slug: "how-to-upgrade-laptop-ram-memory",
      title:
        "How to Upgrade Your Laptop's Memory (RAM) — and When It's Worth It",
      excerpt:
        "'How to install memory in laptop' has seen a huge spike in searches. Here's an honest guide to whether your laptop can even be upgraded, and what the process actually involves.",
      metaTitle: "How to Upgrade Laptop RAM — Full Guide",
      metaDescription:
        "Can your laptop's RAM be upgraded? A clear guide to checking compatibility, the upgrade process, and when it's actually worth doing.",
      coverImage: unsplash("photo-1518770660439-4636190af475"),
      tags: ["how-to", "ram", "upgrade", "guide"],
      publishedAt: daysAgo(28),
      content: `<p>"How to install memory in laptop" has spiked sharply as a search recently — likely from people whose laptop feels slow and have heard that adding RAM can help. It often can, but not every laptop allows it. Here's how to find out, and what's actually involved.</p>

<h2>Step 1: Check if your laptop's RAM is even upgradable</h2>
<p>Many modern thin-and-light laptops — including most MacBooks since 2016, and many ultra-slim Windows ultrabooks — have RAM soldered directly onto the motherboard. If that's the case, <strong>it cannot be upgraded at all</strong>, no matter what. Thicker business laptops and workstations (ThinkPads, EliteBooks, ZBooks, Latitudes and Precisions in particular) are far more likely to use removable SODIMM memory modules that can be swapped or added to.</p>

<h2>Step 2: Check how much RAM you currently have, and your maximum</h2>
<p>On Windows, open <strong>Task Manager</strong> (Ctrl + Shift + Esc) and check the Performance tab for your installed RAM and how many slots are in use. On a Mac, click the Apple menu and choose <em>About This Mac</em>. Your laptop's exact model number will tell you its maximum supported RAM — check the manufacturer's official specification page for that model.</p>

<h2>Step 3: Buy the correct RAM type</h2>
<p>Laptop RAM comes in different generations (DDR3, DDR4, DDR5) and speeds, and using the wrong type simply won't work — it won't fit the slot, or the system won't recognize it. This is not a part to guess on.</p>

<blockquote>We'll be straightforward here: we don't currently stock standalone RAM modules. If your laptop needs more memory, message us the exact model and we can advise on compatible RAM and connect you with fitting — we just don't want you buying the wrong stick based on a generic guide.</blockquote>

<h2>Step 4: Installation itself</h2>
<p>On laptops that support it, this usually means removing a small back panel, locating the RAM slot(s), and clipping the new module in at an angle before pressing it flat until it clicks. It's a reasonably accessible repair if you're comfortable opening electronics — but if you're not, we'd recommend having it fitted professionally rather than risking damage to the connector.</p>

<h2>Is it actually worth it?</h2>
<p>If your laptop is slow because of insufficient RAM (frequent freezing with many tabs/apps open), upgrading RAM is one of the highest-impact fixes available. If it's slow because it's still running a traditional hard drive, an SSD upgrade — not more RAM — is usually the bigger win. See our <a href="/products/hdd-500gb">storage options</a> if extra space, specifically, is the issue.</p>

<p>Message us on WhatsApp with your exact laptop model and we'll tell you honestly whether a RAM upgrade is possible and worth it before you spend anything.</p>`,
    },

    // 7 -----------------------------------------------------------------
    {
      slug: "running-android-apps-on-laptop-bluestacks",
      title: "Running Android Apps on Your Laptop with BlueStacks",
      excerpt:
        "BlueStacks is a legitimate, widely-used way to run Android apps and games on a Windows laptop. Here's how it works and what it's actually good for.",
      metaTitle: "How to Run Android Apps on Your Laptop (BlueStacks Guide)",
      metaDescription:
        "A guide to BlueStacks, the official Android emulator for running mobile apps and games on your Windows laptop, plus tips for a smooth experience.",
      coverImage: unsplash("photo-1551650975-87deedd944c3"),
      tags: ["how-to", "android", "bluestacks", "guide"],
      publishedAt: daysAgo(30),
      content: `<p>BlueStacks is one of the most widely used Android emulators available, and for good reason — it's a legitimate, officially distributed tool that lets you run Android apps and games on a Windows laptop, with a bigger screen, a keyboard and mouse, and generally no battery-drain concerns compared to a phone.</p>

<h2>What BlueStacks is actually useful for</h2>
<ul>
<li><strong>Mobile games</strong> that are more comfortable to play with a keyboard and mouse, or on a bigger screen.</li>
<li><strong>Running a mobile-only app</strong> that doesn't have a proper desktop version.</li>
<li><strong>Testing or development</strong> if you build mobile apps and want to check how they behave without a physical device.</li>
</ul>

<h2>How to get started</h2>
<ol>
<li>Download BlueStacks from its official site (<strong>bluestacks.com</strong>) — avoid third-party download mirrors.</li>
<li>Install it like any other Windows application.</li>
<li>Sign in with a Google account on first launch, the same way you would on an Android phone.</li>
<li>Search the built-in Play Store for the app you want, and install it as normal.</li>
</ol>

<h2>What kind of laptop handles it well</h2>
<p>BlueStacks runs an entire Android system inside Windows, so it benefits from a decent processor and at least 8GB of RAM — running it on a laptop with only 4GB will feel sluggish for anything beyond the simplest apps. If you're specifically buying a laptop with BlueStacks or similar emulation in mind, look at our <a href="/products?category=laptops">16GB RAM configurations</a>, which give it comfortable headroom alongside your normal laptop use.</p>

<blockquote>BlueStacks itself is completely legitimate software with genuine everyday uses — just always download it from the official site, and be cautious of any third-party "modified" versions bundled with other software.</blockquote>

<p>Browse our <a href="/products?category=laptops">full laptop range</a> if you're shopping with this kind of use in mind, or message us on WhatsApp if you want a recommendation based on exactly what you plan to run.</p>`,
    },

    // 8 -----------------------------------------------------------------
    {
      slug: "where-to-buy-laptops-in-kenya",
      title: "Where to Buy Laptops in Kenya: What's Actually Different",
      excerpt:
        "'Jumia laptops' and 'laptops for sale in kenya' are both frequently searched. Here's an honest comparison of buying from a marketplace versus a dedicated laptop dealer.",
      metaTitle: "Where to Buy Laptops in Kenya — Marketplace vs. Dealer",
      metaDescription:
        "Comparing where to buy a laptop in Kenya — large online marketplaces versus a dedicated laptop dealer — and what actually differs between them.",
      coverImage: unsplash("photo-1522204523234-8729aa6e3d5f"),
      tags: ["buying-guide", "kenya", "where-to-buy"],
      publishedAt: daysAgo(32),
      content: `<p>"Jumia laptops" and "laptops for sale in Kenya" are both consistently searched terms, and they point to a genuine question: where should you actually buy from? Large general marketplaces and a dedicated laptop dealer each have real trade-offs worth understanding before you decide.</p>

<h2>Large online marketplaces</h2>
<p>Marketplaces like Jumia carry a huge breadth of listings from many different sellers, which means wide selection and often competitive pricing on popular items. The trade-off is that you're typically buying from a third-party seller you can't inspect or question directly, with variable guarantees on condition, especially for refurbished stock, and you generally can't verify exactly which unit you'll receive until it arrives.</p>

<h2>A dedicated laptop dealer</h2>
<p>Buying from a specialist — browsing our <a href="/products?category=laptops">laptop range</a> directly — means you can see exactly what condition a specific unit is in, ask detailed questions about a specific laptop before committing, and get a warranty backed by a team you can actually message or call afterward. Ordering through WhatsApp also means a real conversation happens before money changes hands, rather than a one-way listing.</p>

<h2>What to actually compare, wherever you buy</h2>
<ul>
<li><strong>Can you verify the actual unit's condition</strong> before paying, or only after it arrives?</li>
<li><strong>How will you get support</strong> if something is wrong with it in the first weeks?</li>
<li><strong>What exactly does the warranty cover</strong>, and for how long?</li>
<li><strong>How long will you wait</strong> to have it in hand?</li>
</ul>

<blockquote>Neither approach is universally better — a marketplace suits someone who knows exactly which model they want and is comfortable with standard shipping timelines; a dedicated dealer suits someone who wants to ask questions and get a straight answer before buying.</blockquote>

<p>If a same-day, inspectable, warrantied purchase matters to you, browse our full catalog by <a href="/products?category=laptops">category</a>, <a href="/products?brand=hp">brand</a> or <a href="/products?collection=best-sellers">collection</a>, with orders placed directly over WhatsApp.</p>`,
    },
  ];
}

async function seedBlogs() {
  const seeds = blogSeeds();
  let count = 0;

  for (const b of seeds) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: {
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        tags: b.tags,
        status: BlogStatus.PUBLISHED,
        metaTitle: b.metaTitle,
        metaDescription: b.metaDescription,
        publishedAt: b.publishedAt,
        authorId: null,
      },
      create: {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        tags: b.tags,
        status: BlogStatus.PUBLISHED,
        metaTitle: b.metaTitle,
        metaDescription: b.metaDescription,
        publishedAt: b.publishedAt,
        authorId: null,
      },
    });
    count++;
  }

  console.log(`✓ Blogs (${count})`);
}

async function main() {
  console.log("Seeding second batch of trend-based blog posts...\n");
  await seedBlogs();
  console.log("\nBlog seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
