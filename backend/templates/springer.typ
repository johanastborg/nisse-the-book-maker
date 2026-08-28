#let springer-blue = rgb("#0a2540")
#let springer-gold = rgb("#d97706")
#let springer-gold-light = rgb("#fef3c7")
#let springer-navy = rgb("#1e293b")
#let callout-bg = rgb("#f8fafc")
#let border-gray = rgb("#cbd5e1")

// Academic Symbol Helpers
#let hbar = $planck$


// Academic Theorem & Callout Boxes
#let theorem(title: "Theorem", body) = {
  v(0.8em)
  block(
    fill: rgb("#fffbeb"),
    stroke: (left: 3.5pt + rgb("#d97706"), rest: 0.5pt + rgb("#fde68a")),
    inset: (x: 14pt, y: 11pt),
    radius: (right: 4pt),
    width: 100%,
    [
      #text(weight: "bold", fill: rgb("#92400e"))[#title.]
      #h(0.4em)
      #text(style: "italic")[#body]
    ]
  )
  v(0.8em)
}

#let definition(title: "Definition", body) = {
  v(0.8em)
  block(
    fill: rgb("#f0fdf4"),
    stroke: (left: 3.5pt + rgb("#16a34a"), rest: 0.5pt + rgb("#bbf7d0")),
    inset: (x: 14pt, y: 11pt),
    radius: (right: 4pt),
    width: 100%,
    [
      #text(weight: "bold", fill: rgb("#166534"))[#title.]
      #h(0.4em)
      #body
    ]
  )
  v(0.8em)
}

#let lemma(title: "Lemma", body) = {
  v(0.8em)
  block(
    fill: rgb("#f8fafc"),
    stroke: (left: 3.5pt + rgb("#64748b"), rest: 0.5pt + rgb("#e2e8f0")),
    inset: (x: 14pt, y: 11pt),
    radius: (right: 4pt),
    width: 100%,
    [
      #text(weight: "bold", fill: rgb("#334155"))[#title.]
      #h(0.4em)
      #text(style: "italic")[#body]
    ]
  )
  v(0.8em)
}

#let proposition(title: "Proposition", body) = {
  v(0.8em)
  block(
    fill: rgb("#eff6ff"),
    stroke: (left: 3.5pt + rgb("#2563eb"), rest: 0.5pt + rgb("#bfdbfe")),
    inset: (x: 14pt, y: 11pt),
    radius: (right: 4pt),
    width: 100%,
    [
      #text(weight: "bold", fill: rgb("#1e40af"))[#title.]
      #h(0.4em)
      #body
    ]
  )
  v(0.8em)
}

#let proof(body) = {
  v(0.5em)
  block(
    inset: (left: 10pt, right: 10pt, top: 4pt, bottom: 6pt),
    stroke: (left: 1.5pt + rgb("#94a3b8")),
    [
      #text(weight: "bold", style: "italic", fill: rgb("#475569"))[Proof.]
      #h(0.4em)
      #body
      #align(right)[#text(size: 11pt)[$square$]]
    ]
  )
  v(0.6em)
}

#let example(title: "Example", body) = {
  v(0.8em)
  block(
    fill: rgb("#fafafa"),
    stroke: 0.5pt + rgb("#e5e7eb"),
    inset: (x: 14pt, y: 10pt),
    radius: 4pt,
    width: 100%,
    [
      #text(weight: "bold", fill: rgb("#374151"))[#title.]
      #h(0.4em)
      #body
    ]
  )
  v(0.8em)
}

#let remark(title: "Remark", body) = {
  v(0.6em)
  [
    #text(weight: "bold", style: "italic", fill: rgb("#4b5563"))[#title.]
    #h(0.4em)
    #body
  ]
  v(0.6em)
}

#let chapter-abstract(body) = {
  block(
    fill: rgb("#f8fafc"),
    stroke: (left: 3pt + rgb("#0284c7"), rest: 0.5pt + rgb("#e2e8f0")),
    inset: (x: 16pt, y: 12pt),
    radius: (right: 4pt),
    width: 100%,
    [
      #text(weight: "bold", size: 9.5pt, fill: rgb("#0369a1"))[CHAPTER ABSTRACT]
      #v(0.4em)
      #text(size: 9.5pt, style: "italic", fill: rgb("#334155"))[#body]
    ]
  )
  v(1.5em)
}

// Master Book Template Function
#let book(
  title: "Theoretical Foundations",
  subtitle: "A Comprehensive Monograph",
  author: "Prof. N. Bohr & A. Einstein",
  affiliation: "Institute for Advanced Study",
  series: "Graduate Texts in Physics",
  discipline: "Theoretical Physics",
  edition: "First Edition",
  dedication: "To all seekers of fundamental mathematical truths.",
  preface: "",
  notation_conventions: "",
  body
) = {
  // Page Settings
  set page(
    paper: "a4",
    margin: (top: 3cm, bottom: 2.8cm, left: 3cm, right: 3cm),
    header: context {
      let page_number = counter(page).get().first()
      if page_number > 3 {
        align(right)[
          #text(8pt, fill: rgb("#64748b"), weight: "medium")[
            #smallcaps[#series] $space.thin | space.thin$ #title
          ]
        ]
      }
    },
    footer: context {
      let page_number = counter(page).get().first()
      if page_number > 1 {
        align(center)[
          #text(9pt, fill: rgb("#475569"))[#page_number]
        ]
      }
    }
  )

  // Typography & Paragraph rules
  set text(
    font: ("New Computer Modern", "Linux Libertine", "DejaVu Serif", "Georgia", "serif"),
    size: 10.5pt,
    lang: "en",
    fill: rgb("#0f172a")
  )
  set par(
    justify: true,
    leading: 0.72em,
    first-line-indent: 1.2em
  )
  set heading(numbering: "1.1")
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    v(1.5cm)
    text(fill: rgb("#d97706"), size: 13pt, weight: "bold")[
      #smallcaps[Chapter #counter(heading).display()]
    ]
    v(0.3em)
    text(fill: rgb("#0f172a"), size: 21pt, weight: "bold")[
      #it.body
    ]
    v(0.6em)
    line(length: 100%, stroke: 1.5pt + rgb("#d97706"))
    v(1.2em)
  }
  show heading.where(level: 2): it => {
    v(1.4em)
    text(fill: rgb("#1e293b"), size: 13pt, weight: "bold")[
      #it.body
    ]
    v(0.6em)
  }
  show heading.where(level: 3): it => {
    v(1em)
    text(fill: rgb("#334155"), size: 11pt, weight: "bold")[
      #it.body
    ]
    v(0.4em)
  }

  // ==========================================
  // 1. SPRINGER SIGNATURE COVER PAGE
  // ==========================================
  {
    set page(
      margin: (top: 0cm, bottom: 0cm, left: 0cm, right: 0cm),
      header: none,
      footer: none
    )
    
    // Top Gold / Yellow Springer Accent Band
    block(
      fill: rgb("#f59e0b"),
      width: 100%,
      height: 28%,
      inset: (x: 3.5cm, top: 2.5cm, bottom: 1.5cm),
      [
        #text(size: 13pt, weight: "bold", fill: rgb("#78350f"))[
          #smallcaps[#series]
        ]
        #v(0.5em)
        #text(size: 10pt, fill: rgb("#92400e"), weight: "medium")[
          #discipline $space.quad | space.quad$ #edition
        ]
        #v(1.2em)
        #line(length: 4cm, stroke: 2pt + rgb("#78350f"))
      ]
    )

    // Main Cover Body (Navy / Slate)
    block(
      fill: rgb("#0f172a"),
      width: 100%,
      height: 72%,
      inset: (x: 3.5cm, y: 2.8cm),
      [
        #v(0.5cm)
        #text(size: 27pt, weight: "bold", fill: rgb("#ffffff"), font: ("New Computer Modern", "Georgia", "serif"))[
          #title
        ]
        #v(0.8em)
        #text(size: 15pt, style: "italic", fill: rgb("#cbd5e1"))[
          #subtitle
        ]
        
        #v(2.5cm)
        #line(length: 100%, stroke: 0.8pt + rgb("#334155"))
        #v(1cm)

        #grid(
          columns: (1fr, auto),
          [
            #text(size: 14pt, weight: "bold", fill: rgb("#f8fafc"))[#author] \
            #v(0.3em)
            #text(size: 10.5pt, fill: rgb("#94a3b8"))[#affiliation]
          ],
          [
            #align(right + horizon)[
              #rect(
                stroke: 1pt + rgb("#f59e0b"),
                inset: (x: 10pt, y: 6pt),
                radius: 3pt,
                [#text(size: 9pt, weight: "bold", fill: rgb("#f59e0b"))[AUTONOMOUS PUBLISHING PIPELINE]]
              )
            ]
          ]
        )

        #v(2.5cm)
        #align(bottom + left)[
          #text(size: 9.5pt, fill: rgb("#64748b"))[
            Published under Springer-grade Open Textbook Architecture
          ]
        ]
      ]
    )
  }

  pagebreak()

  // ==========================================
  // 2. HALF-TITLE & COLOPHON PAGE
  // ==========================================
  {
    set page(header: none, footer: none)
    v(3cm)
    align(center)[
      #text(size: 16pt, weight: "bold", fill: rgb("#1e293b"))[#title] \
      #v(0.5em)
      #text(size: 11pt, style: "italic", fill: rgb("#64748b"))[#subtitle]
    ]

    v(12cm)
    align(bottom + left)[
      #line(length: 100%, stroke: 0.5pt + rgb("#cbd5e1"))
      #v(0.5em)
      #text(size: 8pt, fill: rgb("#64748b"))[
        #text(weight: "bold")[#title] \
        Series: #series \
        Author: #author \
        Affiliation: #affiliation \
        #v(0.4em)
        Typeset using the *Nisse Multi-Agent Publishing Pipeline* with the Typst Compiler. \
        Mathematical formatting conforms to International Standards for Scientific Monograph Publishing. \
        © 2026 Author(s). All rights reserved. Open Access Edition.
      ]
    ]
  }

  pagebreak()

  // ==========================================
  // 3. DEDICATION
  // ==========================================
  if dedication != "" {
    set page(header: none, footer: none)
    v(7cm)
    align(center)[
      #text(size: 12pt, style: "italic", fill: rgb("#334155"))[
        #dedication
      ]
    ]
    pagebreak()
  }

  // ==========================================
  // 4. PREFACE
  // ==========================================
  if preface != "" {
    v(1.5cm)
    align(left)[
      #text(size: 20pt, weight: "bold", fill: rgb("#0f172a"))[Preface]
      #v(0.4em)
      #line(length: 100%, stroke: 1.5pt + rgb("#d97706"))
      #v(1em)
    ]
    preface
    v(1.5em)
    align(right)[
      #text(style: "italic", fill: rgb("#475569"))[#author \ #affiliation]
    ]
    pagebreak()
  }

  // ==========================================
  // 5. NOTATION & CONVENTIONS
  // ==========================================
  if notation_conventions != "" {
    v(1.5cm)
    align(left)[
      #text(size: 20pt, weight: "bold", fill: rgb("#0f172a"))[Notation and Conventions]
      #v(0.4em)
      #line(length: 100%, stroke: 1.5pt + rgb("#d97706"))
      #v(1em)
    ]
    notation_conventions
    pagebreak()
  }

  // ==========================================
  // 6. TABLE OF CONTENTS
  // ==========================================
  {
    v(1.5cm)
    align(left)[
      #text(size: 20pt, weight: "bold", fill: rgb("#0f172a"))[Contents]
      #v(0.4em)
      #line(length: 100%, stroke: 1.5pt + rgb("#d97706"))
      #v(1em)
    ]
    outline(indent: auto, depth: 3)
    pagebreak()
  }

  // ==========================================
  // 7. CHAPTERS & MAIN CONTENT
  // ==========================================
  body
}
