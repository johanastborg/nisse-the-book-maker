import os
import tempfile
import typst

workspace_root = os.path.abspath(".")
test_doc = """
#import "backend/templates/springer.typ": book, theorem, definition, lemma, proof, example, remark, chapter-abstract

#show: book.with(
  title: "Space-Time Physics & Differential Geometry",
  subtitle: "Mathematical Foundations of General Relativity and Gauge Fields",
  author: "Prof. N. Bohr & A. Einstein",
  affiliation: "Institute for Advanced Study, Princeton",
  series: "Graduate Texts in Contemporary Physics",
  discipline: "Theoretical Physics",
  edition: "Third Revised Edition",
  dedication: "Dedicated to the unified understanding of geometry and gravitation.",
  preface: [
    This monograph provides a rigorous and pedagogical exposition of modern Lorentzian geometry and its physical applications in general relativity and field theory.
  ],
  notation_conventions: [
    We adopt the standard pseudo-Riemannian metric signature $(- , + , + , +)$. Greek indices $mu, nu, lambda in {0, 1, 2, 3}$ denote spacetime coordinates, while Roman indices $i, j, k in {1, 2, 3}$ label spatial components. Einstein summation convention is enforced throughout.
  ]
)

= Differential Manifolds and Tangent Bundles

#chapter-abstract[
  In this chapter, we establish the differential-geometric substrate of spacetime. We define smooth manifolds, tangent and cotangent spaces, and tensor fields under coordinate transformations.
]

== Smooth Manifolds and Coordinate Atlases

Let $cal(M)$ be a Hausdorff, second-countable topological space. A smooth atlas on $cal(M)$ is a collection of charts ${(U_alpha, phi_alpha)}$ covering $cal(M)$ such that transition maps are $C^infinity$ diffeomorphisms.

#definition(title: "Definition 1.1 (Smooth Manifold)")[
  A topological manifold $cal(M)$ of dimension $n$ equipped with a maximal smooth atlas is called a *smooth manifold*.
]

The tangent space $T_p cal(M)$ at point $p in cal(M)$ is defined algebraically as the vector space of derivations on smooth germ functions:
$ v(f g) = v(f) g(p) + f(p) v(g), quad forall f, g in C^infinity(cal(M)) $

== The Metric Tensor and Geodesic Flow

A pseudo-Riemannian metric $g$ is a smooth $(0, 2)$-tensor field that is symmetric and non-degenerate at every point $p in cal(M)$.

#theorem(title: "Theorem 1.1 (Levi-Civita Connection)")[
  On any pseudo-Riemannian manifold $(cal(M), g)$, there exists a unique torsion-free affine connection $nabla$ that is metric compatible, i.e., $nabla g = 0$.
]

#proof[
  The Christoffel symbols $Gamma_(mu nu)^lambda$ in local coordinates are uniquely determined by:
  $ Gamma_(mu nu)^lambda = 1/2 g^(lambda sigma) (partial_mu g_(nu sigma) + partial_nu g_(mu sigma) - partial_sigma g_(mu nu)) $
  Direct substitution confirms that $nabla_lambda g_(mu nu) = 0$ and $[nabla_mu, nabla_nu] f = 0$ for any smooth scalar $f$.
]

The Riemann curvature tensor measures the non-commutativity of covariant derivatives:
$ [nabla_mu, nabla_nu] V^lambda = R^lambda_(sigma mu nu) V^sigma $

where in coordinate basis:
$ R^lambda_(sigma mu nu) = partial_mu Gamma_(nu sigma)^lambda - partial_nu Gamma_(mu sigma)^lambda + Gamma_(mu rho)^lambda Gamma_(nu sigma)^rho - Gamma_(nu rho)^lambda Gamma_(mu sigma)^rho $

#example(title: "Example 1.1 (Schwarzschild Spacetime)")[
  The exterior vacuum metric for a spherically symmetric mass $M$ is given in Schwarzschild coordinates $(t, r, theta, phi)$ by:
  $ dif s^2 = - (1 - (2 G M)/(r c^2)) c^2 dif t^2 + (1 - (2 G M)/(r c^2))^(-1) dif r^2 + r^2 (dif theta^2 + sin^2 theta dif phi^2) $
]
"""

with tempfile.NamedTemporaryFile("w", suffix=".typ", delete=False, dir=workspace_root) as f:
    f.write(test_doc)
    doc_path = f.name

try:
    pdf_bytes = typst.compile(doc_path, root=workspace_root)
    print(f"[SUCCESS] Compiled Springer textbook PDF! Byte count: {len(pdf_bytes)}")
finally:
    if os.path.exists(doc_path):
        os.remove(doc_path)
