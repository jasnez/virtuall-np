# Faza 12: Cross-browser testiranje – checklist

Projekt koristi **Tailwind CSS v4** s Lightning CSS; prefiksi se u produkcijskom buildu dodaju automatski za ciljane preglednike (Chrome 111+, Safari 16.4+, Firefox 128+, Edge 111+).

---

## 12.1 Chrome (latest)

- [ ] Početna stranica: hero, value props, CTA, footer
- [ ] Navigacija: header sticky, linkovi, Get a Quote, mobile meni
- [ ] Stranice: Services, How We Work, Packages, Contact, Privacy Policy
- [ ] Contact forma: polja, validacija, submit
- [ ] Cookie banner: prikaz, Accept/Decline, sakrivanje
- [ ] Animacije: scroll reveal (npr. How We Work), card hover, button hover
- [ ] Linkovi: mailto, tel, interni, Skip to content

---

## 12.2 Firefox (latest)

Posebno provjeri:

- [ ] **backdrop-blur** – header (sticky) ima `backdrop-blur-md`; treba blag blur iza headera kada nije scrollano
- [ ] **Grid layout** – Footer 3 kolone, Value props 4 kolone, Packages kartice, Services/Contact grid
- [ ] **Animacije** – Framer Motion (mobile meni slide, FAQ accordion, scroll reveal); trebaju raditi bez pucanja
- [ ] Fontovi (Inter), boje, shadow na karticama

---

## 12.3 Safari (latest, desktop + iOS ako je moguće)

Posebno provjeri:

- [ ] **Sticky positioning** – header ostaje na vrhu pri scrollanju
- [ ] **Smooth scroll** – `scroll-behavior: smooth` na `<html>`; Skip to content / anchor linkovi
- [ ] **Form styling** – input, select, textarea bez default Safari izgleda (u kodu je `appearance: none` za konzistentnost)
- [ ] **backdrop-blur** – podrška u novijem Safariju
- [ ] **Flexbox gap** – korišten na mnogim mjestima; treba raditi u Safari 14.1+
- [ ] **Cookie banner** – localStorage i cookie; ponovna posjeta bez bannera

---

## 12.4 Edge (latest)

Edge je Chromium-based; ponašanje blisko Chromeu.

- [ ] Svi glavni flowovi kao u Chromeu
- [ ] Sticky header, animacije, forme, cookie consent
- [ ] Nema konzolnih grešaka specifičnih za Edge

---

## 12.5 CSS prefiksi i stariji preglednici

**Što je napravljeno u kodu:**

- **Tailwind v4 + Lightning CSS** – u produkcijskom buildu generiraju se potrebni prefiksi za ciljane preglednike (npr. `-webkit-backdrop-filter` za `backdrop-blur`, `-webkit-appearance` za forme).
- **globals.css** – za form kontrole (input, select, textarea) dodano je:
  - `-webkit-appearance: none`, `-moz-appearance: none`, `appearance: none`  
  kako bi Safari i Firefox koristili naš border/radius umjesto default izgleda.
- **scroll-behavior: smooth** – nema standardnog prefiksa; podrška u modernim preglednicima (Safari 15.4+).
- **position: sticky** – dobro podržan u svim modernim preglednicima; stariji Safari je imao `-webkit-sticky`, ali ciljani range (Safari 16.4+) to ne zahtijeva iz Tailwinda.

**Ciljani preglednici (Tailwind v4):**  
Chrome 111+, Safari 16.4+, Firefox 128+, Edge 111+. Za starije preglednike potrebna bi bila dodatna provjera ili downgrade na Tailwind v3 + Autoprefixer.

---

## Brzi zapis rezultata

| Browser      | Verzija | Datum  | Rezultat (OK / problem) |
|-------------|---------|--------|--------------------------|
| Chrome      |         |        |                          |
| Firefox     |         |        |                          |
| Safari      |         |        |                          |
| Edge        |         |        |                          |
