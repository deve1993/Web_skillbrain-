# Coolify Deploy — skillbrain.fl1.it

Step-by-step per portare Web_SkillBrain online sul server Coolify.

## Prerequisiti

- Repo GitHub `deve1993/web-skillbrain` pubblico, branch `main` (creato in Sprint 1).
- Coolify accessibile (probabilmente https://coolify.fl1.it o IP del server).
- DNS controllabile per `fl1.it` (per puntare il sottodominio).
- API key Resend (per il form contatto). Se non l'hai: https://resend.com/api-keys

## 1 · DNS

Nel pannello DNS di `fl1.it`, aggiungi un record:

```
Type:   CNAME (o A se Coolify gira su IP fisso)
Name:   skillbrain
Value:  <hostname o IP del server Coolify>
TTL:    3600 (o auto)
```

Verifica la propagazione:
```bash
dig +short skillbrain.fl1.it
```

## 2 · Crea l'applicazione su Coolify

1. **Resources → New → Application**
2. **Source**: GitHub App (deve già essere collegato a Coolify) → seleziona `deve1993/web-skillbrain`, branch `main`
3. **Build pack**: `Dockerfile` (Coolify rileva automaticamente il `Dockerfile` alla root)
4. **Port**: `3000` (esposto dal Dockerfile)
5. **Domain**: `skillbrain.fl1.it`
6. **HTTPS**: abilita Let's Encrypt (Coolify lo gestisce in automatico via Traefik)

## 3 · Variabili d'ambiente

Nella tab "Environment variables", aggiungi (build-time + runtime):

```
NEXT_PUBLIC_SITE_URL=https://skillbrain.fl1.it
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=skillbrain.fl1.it
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=SkillBrain <hello@skillbrain.fl1.it>
SKILLBRAIN_API_URL=https://memory.fl1.it
SKILLBRAIN_API_KEY=<solo se la API stats richiede auth, altrimenti vuoto>
```

> **Nota Resend "from"**: per usare `hello@skillbrain.fl1.it` come mittente devi prima verificare il dominio `skillbrain.fl1.it` su Resend (TXT + DKIM records). In alternativa, lascia il default `SkillBrain <onboarding@resend.dev>` per i primi test — funziona ma finisce in spam più facilmente.

## 4 · Deploy

1. Clicca **Deploy** in Coolify.
2. La build dura ~3-5 min (multi-stage Docker, deps cache, Next build, standalone output).
3. Coolify pulla l'immagine, la avvia, configura Traefik per il dominio.
4. Apri https://skillbrain.fl1.it → dovrebbe redirectare a `/it`.

## 5 · Smoke test post-deploy

```bash
for path in / /it /en /cs /sitemap.xml /robots.txt /it/legal/privacy; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' -L https://skillbrain.fl1.it$path)  $path"
done
```

Tutti devono rispondere `200`.

Test del form: invia una request fake dalla sezione "Done-for-you" e verifica che ti arrivi la mail su `daniel@pixarts.eu`.

## 6 · Auto-deploy on push

Coolify ha già abilitato il webhook GitHub (lo crea da solo collegando il repo). Ogni push su `main` triggera un deploy automatico. Per disabilitarlo: app settings → "Automatic Deployment".

## 7 · Healthcheck

Il `Dockerfile` include un `HEALTHCHECK` che pinga `http://127.0.0.1:3000/` ogni 30s. Se la container risponde 5xx ripetutamente, Coolify la riavvia.

## Troubleshooting

| Sintomo | Probabile causa | Fix |
|---|---|---|
| Build fallisce su `pnpm build` | env var mancante | Verifica `NEXT_PUBLIC_*` nel pannello Coolify |
| 502 Bad Gateway | Container non parte (porta sbagliata) | Conferma `PORT=3000` e `EXPOSE 3000` |
| Form non invia | `RESEND_API_KEY` vuota o dominio non verificato | Aggiungi key, verifica dominio su Resend |
| Cert SSL non si genera | DNS non ancora propagato | Aspetta 5-30 min, poi rilancia "Check certificate" |
| Stats live a 0 | `SKILLBRAIN_API_URL` non raggiungibile | Verifica `memory.fl1.it` risponde, fallback statico è OK |

## Quando il sito è online

- Aggiungi il dominio in Plausible Analytics (https://plausible.io) per tracking privacy-first
- Indicizza il sitemap in Google Search Console: https://skillbrain.fl1.it/sitemap.xml
- Aggiorna il README del repo prodotto (`deve1993/skillbrain`) con il link al sito
- (Sprint 2/3) Carica i video AI in `public/videos/` e committali — Coolify ridepiega da solo
