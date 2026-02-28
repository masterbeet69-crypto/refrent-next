# Auth Modal — Design Document

**Date :** 2026-02-28
**Statut :** Approuvé

---

## Objectif

Remplacer la navigation vers `/login` et `/register` par une modale contextuelle qui s'ouvre depuis n'importe quel point d'entrée (Nav, landing page, fiche de bien, etc.). Après connexion ou inscription, l'utilisateur reste sur la page courante.

---

## Architecture

### Nouveaux fichiers
| Fichier | Rôle |
|---|---|
| `components/auth/AuthModalContext.tsx` | Context + Provider + hook `useAuthModal()` |
| `components/auth/AuthModal.tsx` | Modale complète (login + register, 1 composant) |

### Fichiers modifiés
| Fichier | Changement |
|---|---|
| `app/(public)/layout.tsx` | Wrap dans `<AuthModalProvider>`, render `<AuthModal />` |
| `components/layout/Nav.tsx` | Boutons "Connexion"/"S'inscrire" → `openAuthModal()` |
| `app/(public)/page.tsx` | Bouton "Créer un compte agent" → `openAuthModal('register')` |
| `app/(auth)/login/page.tsx` | Conservé (fallback middleware), peut aussi ouvrir la modale |
| `app/(auth)/register/page.tsx` | Conservé (fallback middleware) |

---

## Context API

```ts
interface AuthModalContextValue {
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}
```

Hook d'usage : `const { openAuthModal } = useAuthModal();`

---

## UX de la Modale

### Structure visuelle
```
┌─────────────────────────────────────┐
│  [ Connexion ]  [ S'inscrire ]      │  ← tabs avec bordure active
├─────────────────────────────────────┤
│                                     │
│  Bon retour !  /  Créer un compte   │  ← titre Fraunces
│                                     │
│  ──────── Continuer avec ────────   │
│  [ G  Google ]   [ f  Facebook ]    │  ← OAuth (configurables)
│  ──────────────────────────────     │
│                                     │
│  Tab Connexion :                    │
│    Email ________________           │
│    Mot de passe __________          │
│    [erreur inline si échec]         │
│    [ Se connecter ────────]         │
│                                     │
│  Tab S'inscrire :                   │
│    ┌─ Particulier ─┬─ Agent ─┐      │  ← toggle rôle
│    └───────────────┴─────────┘      │
│    Nom complet ___________          │
│    Email __________________         │
│    Mot de passe ___________         │
│    (Pays + Ville si Agent)          │
│    [erreur inline si échec]         │
│    [ Créer mon compte ─────]        │
│                                     │
└─────────────────────────────────────┘
```

### Comportements
- **Overlay** : `rgba(0,0,0,0.4)`, clic en dehors → ferme
- **Escape** → ferme
- **Animation** : `opacity 0→1` + `translateY(8px→0)` en CSS (pas framer-motion)
- **Après login réussi** : `closeAuthModal()` + `router.refresh()`
- **Après register réussi** : login automatique → `closeAuthModal()` + `router.refresh()`
- **Erreurs** : inline sous le formulaire (`color: '#9B1C1C'`)

### OAuth (Google + Facebook)
- Boutons affichés avec icônes SVG inline
- `disabled` et `opacity: 0.5` + tooltip "Bientôt disponible" tant que non configurés
- Activables via variables d'env : `NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=true`

---

## Flux de données

```
User clique "Connexion" (Nav)
  → useAuthModal().openAuthModal('login')
  → AuthModalContext setState({ open: true, mode: 'login' })
  → AuthModal s'affiche

User remplit email + password → soumet
  → POST /api/v1/auth/login
  → { ok: true } → cookies rf_jwt + rf_role posés
  → closeAuthModal() + router.refresh()
  → Server components relisent la session → page mise à jour

User clique "S'inscrire" tab → choisit "Agent"
  → POST /api/v1/auth/register { role: 'agent', ... }
  → { ok: true, user_id: ... }
  → POST /api/v1/auth/login (auto-login)
  → closeAuthModal() + router.refresh()
```

---

## Audit du site (tâches parallèles)

1. Vérifier que tous les liens Nav/Footer/Sidebar pointent vers des routes existantes
2. Tester inscription → vérifier entrée dans `auth.users` + `profiles` Supabase
3. Vérifier que les codes REF démo affichent "Bien introuvable" (déjà corrigé)
4. Vérifier la navigation fluide entre les pages (pas de reload complet inutile)

---

## Non inclus (YAGNI)

- Mot de passe oublié (peut être ajouté plus tard)
- Vérification d'email (désactivée côté API)
- Redirections post-login vers `/agent/dashboard` (resté sur page courante)
