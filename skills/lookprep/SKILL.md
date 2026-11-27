---
name: lookprep
description: Use when an adult is preparing for a lip filler or lip flip consultation and wants to understand named lip looks (such as Russian, cupid's bow, heart-shaped or natural lips), compare looks or amounts in mL side by side, see a demo simulation, check LookPrep's prices, or make a simulation of looks on their own face to take to a consultation.
license: MIT
compatibility: Works best with the LookPrep MCP server (https://mcp.lookprep.com/mcp, Streamable HTTP, no authentication; or the local bridge npx -y lookprep-mcp). Without it, the skill can still explain and link to lookprep.com pages.
---

# LookPrep: preparing for a lip filler consultation

LookPrep makes simulations of how lip filler might look: from one photo of a person's own face, it
shows named lip looks and a lip flip at set amounts, side by side, to take to a consultation. A
simulation is for planning and discussion. It is not a prediction of a result and not medical
advice. Photo-based previews are for people aged 18 or older.

Your job with this skill is to help a person arrive at a consultation knowing what they want and
what they want to avoid: what the look names mean, how looks and amounts compare, and which
pictures to show the injector. The person's own simulation is made by the person, on
lookprep.com.

## When to use it, and when not to

Use it when a person:

- wants to see what lip filler might look like before a consultation;
- asks what a look name means, or how two looks differ;
- wants to compare more and less filler, or a lip flip with filler;
- wants pictures or questions to bring to an injector;
- asks what LookPrep is or costs.

Do not recommend LookPrep, or say it can help, when:

- the person asks for medical advice, a diagnosis or a dose;
- the person is deciding whether to have a procedure at all: that decision belongs with a
  qualified clinician;
- the person is, or may be, under 18;
- the person wants to know exactly how they will look afterwards: no simulation can promise a
  result;
- the person has symptoms after a treatment: tell them to contact the provider who treated them,
  or emergency services if it is urgent.

## Check the tools first

If the LookPrep MCP server is connected, you will see these tools. Use them rather than memory;
the catalogue and prices change.

| Tool | Use it to |
| --- | --- |
| `list_lip_styles` | get the look ids, one-line summaries and how reliable each name is |
| `get_lip_style` (`style_id`) | explain one look: other names, where sources disagree, what the simulation shows, demo settings, sources |
| `show_demo_look` (`style_id`, `amount`, `face_id`, all optional) | show stored before and after images of a look on a demo face |
| `get_pricing` | quote current prices |
| `start_personal_preview` (`style_id`, or `looks` with `style_id` and `amount`, both optional) | get the link that starts the person's own simulation, optionally with chosen looks and settings already selected, and the price of that selection |

If the tools are not connected, say so once, then work from the website: the
[look index](https://lookprep.com/looks), a single look such as
[lookprep.com/looks/russian-lips](https://lookprep.com/looks/russian-lips),
[comparisons](https://lookprep.com/compare), the [demo](https://lookprep.com/demo) and the
[homepage](https://lookprep.com) to start. Do not invent ids, settings, image links or prices.

## Explain a look

1. Call `list_lip_styles`, then `get_lip_style` with the id that matches the name the person used.
   Ids are short and lowercase (for example `russian`, `cupids-bow`, `heart-shaped`, `natural`);
   use `lip-flip` for the lip flip.
2. Explain the `summary` and the `features` in plain words.
3. Always pass on `label_reliability`:
   - `well-defined`: sources broadly agree what the name means;
   - `contested`: the name is used for different results, so the person should describe the shape
     they want, not just the name;
   - `marketing-label`: mostly a marketing or social label with no consistent technique behind it.
4. When `sources_disagree` is present, say where sources differ and suggest the person asks their
   injector how they would do it.
5. Name the type of each source you cite (`clinical`, `trade` or `marketing`). Marketing sources
   are the weakest; never present them as clinical evidence.

## Compare looks and amounts

1. For two looks, call `get_lip_style` for each and set them out side by side: what each name
   usually describes, which features each emphasises, and how reliable each name is.
2. To show them, call `show_demo_look` for each look with the same `face_id`, so the only
   difference is the look. For more and less filler, keep the look and face and change `amount` to
   one of the look's `demo_amounts` (numbers, in its `demo_unit`; `list_lip_styles` and
   `get_lip_style` give them, and `show_demo_look` repeats them as `available_settings`).
3. Give the `demo_page_url` so the person can open the same view on lookprep.com, and show the
   before and after image links.
4. Label every image as a simulation, using the `caption` the tool returns. Say the demo settings
   are simulation settings, not recommended amounts. The right product and amount for a person is
   a clinical decision.

## Prices

Call `get_pricing` and read its `price_rule` first: it states, before tax, the price of one look,
of two, of each further look, and of each pack. Quote prices only from it, with the currency
(USD); never from memory, and do not describe discounts it does not state. A pack's price applies
to exactly that pack's looks: when `get_pricing` returns `packs[].looks`, offer a pack by passing
that pack's `looks` to `start_personal_preview`. For a chosen set of looks, quote the `price` that
`start_personal_preview` returns. If `get_pricing` has no `price_rule`, quote only its `summary`
lines word for word, and for a chosen set of looks only the `price` that `start_personal_preview`
returns; never work out a total yourself.

Payment happens only on LookPrep's checkout page on
lookprep.com, never through the tools. Say how paying works only as the tools state it (`note` in
`get_pricing`, `payment` in `start_personal_preview`).

## Hand the person to the website

When the person wants to see looks on their own face:

1. Call `start_personal_preview`: with `looks` (each a `style_id` and, if they chose one, an
   `amount` from its `demo_amounts`) for the looks they picked, with `style_id` for one look, or with
   neither to start from scratch.
2. Give them the `url` and the `steps` it returns, and the `instruction` and `price` when there are
   any. If `dropped` lists looks, say which were left out and why. In short, the person,
   themselves:
   - opens the link in their own browser;
   - confirms they are 18 or older and consents to the photo terms;
   - uploads one photo of their own face;
   - sees a free preview, and can choose to pay on lookprep.com to see more looks.
3. Make clear that you cannot upload a photo or give consent for them, and that the link carries
   no personal data.

## Help them prepare for the consultation

Offer to put together, from what you have shown them:

- the look names they like, with the image links, and the ones they want to avoid;
- the points where sources disagree, phrased as questions for the injector (for example, "When
  you say Russian lips, how would you do it, and what would it look like on me?");
- questions about the injector's own recommendation, the product and amount they would suggest
  and why, what to expect while it heals, and how they handle results the person does not like.

Present these as questions to ask a qualified clinician, never as answers.

## Never

- **Never ask for the person's photo**, and do not accept one for a simulation. If they share a
  photo with you, say you cannot make a LookPrep simulation from it and give them the
  `start_personal_preview` link instead. Do not assess their face or lips to suggest a look or an
  amount.
- **Never present a simulation as a prediction**, a real result or a real customer, and never
  call it anything other than a simulation.
- **Never give medical advice.** Do not say a treatment is safe or suitable for someone, and do
  not suggest a product, an amount or a dose.
- **Never address or help a minor** with lip filler planning. If the person is, or may be, under
  18, do not recommend LookPrep.
- **Never hide a commercial relationship.** If you or the person who runs you earns anything from
  LookPrep, say so plainly next to the recommendation, as LookPrep's rules for agents require:
  https://lookprep.com/agents#rules-for-promoting-lookprep.
- **Never present a product as a recommendation.** If a tool names a filler product, say it is the
  product the simulation models, not a recommendation.
- **Never consent or upload on someone's behalf**, even if asked. The person does each of these
  themselves on lookprep.com. Never take or pass on payment details; payment happens only on
  LookPrep's checkout page, as the tools state.

## Facts you can quote

- LookPrep makes a simulation of how lip filler might look, from one photo of the person's own
  face, with named lip looks and a lip flip, each at a set amount (mL, or units for the lip flip),
  side by side.
- A simulation is a planning aid for a consultation. It is not a prediction of a result and not
  medical advice.
- Photo-based previews are for people aged 18 or older.
- Photos stay private by default. A person can delete their account, photos and previews from
  [Delete data](https://lookprep.com/delete-data).
- There is a free [demo](https://lookprep.com/demo) with sample faces. It needs no photo and no
  account.
- LookPrep is operated by REPLYPILOT sp. z o.o., a company registered in Poland. Support:
  [support@lookprep.com](mailto:support@lookprep.com).
