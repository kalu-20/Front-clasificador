# Contribuir a EcoClasificador

¡Gracias por interesarte en mejorar el proyecto! Este monorepo contiene un frontend Next.js y un backend FastAPI; aceptamos contribuciones de ambos lados.

---

## 🌱 Setup local rápido

```bash
git clone https://github.com/kalu-20/Front-clasificador.git
cd Front-clasificador

# Frontend
npm install
npm run dev

# Backend (en otra terminal)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m gdown --id 12vOZKjBJ_2XhtSDgNPVNjkijKscUKK7O -O model.onnx
python -m gdown --id 1u4q5QCdn2PjFiZX4mHyY9ED3S6kxbOYu -O model.onnx.data
uvicorn main:app --reload
```

---

## 🌿 Workflow de PRs

1. Hacé fork del repo (o creá una branch si tenés acceso).
2. Branch nueva: `git checkout -b feat/lo-que-cambies`. Prefijos sugeridos:
   - `feat/` — nueva feature
   - `fix/` — bug fix
   - `docs/` — solo documentación
   - `perf/` — mejora de performance
   - `refactor/` — refactor sin cambio funcional
   - `chore/` — tooling, deps, CI
3. Commits con mensajes descriptivos en imperativo presente: `feat: agregar dropzone con preview`.
4. Antes de pushear, verificá:
   ```bash
   # Frontend
   npm run lint
   npx tsc --noEmit
   npm run build

   # Backend
   python -m py_compile main.py handler/*.py service/*.py
   ```
5. Pushea y abrí un PR contra `main`. Describí *qué* cambió y *por qué*.

---

## ✨ Estilo de código

### Frontend
- **TypeScript estricto**: nada de `any`. Si necesitás escapar, usá `unknown` + narrowing.
- **Componentes**: PascalCase, archivos kebab-case (`category-card.tsx`).
- **Hooks reutilizables** en `hooks/`, utilidades puras en `lib/`.
- **TailwindCSS**: clases en este orden — layout → spacing → typography → color → effects. Para clases dinámicas usá `cn()` (en `lib/cn.ts`).
- **Animaciones**: variants en `lib/motion.ts`. Respeten `prefers-reduced-motion`.
- **Accesibilidad**: `aria-label` en botones-icono, `alt` en imágenes, focus rings visibles.

### Backend
- **PEP 8** con line length 100.
- **Type hints** en todas las firmas públicas.
- **Logging** vía `logging` (no `print` en código de producción).
- **CORS / secrets** vía variables de entorno (ver `.env.example`).

---

## 🎨 Paleta institucional

Respetá la paleta — no introduzcas colores fuera de ella sin discutirlo antes en un issue:

| Color           | Hex       | Variable Tailwind |
| --------------- | --------- | ----------------- |
| Verde oliva     | `#447A00` | `olive`           |
| Amarillo pastel | `#FCF291` | `canvas`          |
| Morado vino     | `#7C1155` | `wine`            |
| Crema           | `#FFF6C2` | `cream`           |
| Magenta footer  | `#820F52` | `magenta`         |

---

## 🐛 Reportar bugs

Abrí un issue con:
- Pasos para reproducir.
- Comportamiento esperado vs. real.
- Browser / OS / version.
- Screenshots si aplica.
- Logs de consola si hay error JS.

---

## 💡 Proponer features

Antes de implementarlas, abrí un issue con label `enhancement` para discutirlo. Esto evita que invertimos esfuerzo en algo que no encaje con la visión del proyecto.

---

## 📄 Licencia

Al contribuir, aceptás que tu código se distribuya bajo la misma [licencia MIT](LICENSE) del proyecto.
