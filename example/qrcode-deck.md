---
title: QR code
description: Slide with embedded QR code
theme: gaia
class: gaia
---

<!--
_class:
  - lead
  - gaia
-->

# **QR** code

## mdast-qrcode exmaple slide

https://github.com/hankei6km/mdast-qrcode

![bg left](qrcode:https://github.com/hankei6km/mdast-qrcode)

---

## QR code (url)

source:

```markdown
![h:200](qrcode:https://github.com/hankei6km/mdast-qrcode)
https://github.com/hankei6km/mdast-qrcode
```

yield:

![h:200](qrcode:https://github.com/hankei6km/mdast-qrcode)
https://github.com/hankei6km/mdast-qrcode

---

## QR code (alt)

source:

```markdown
![h:200:qrcode:https://github.com/hankei6km/mdast-qrcode](mdast-qrcode.png)
https://github.com/hankei6km/mdast-qrcode
```

yield:

![h:200:qrcode:https://github.com/hankei6km/mdast-qrcode](mdast-qrcode.png)
https://github.com/hankei6km/mdast-qrcode

---

## QR code (options)

source:

```markdown
![h:200:qrcode:https://github.com/hankei6km/mdast-qrcode](mdast-qrcode-color_dark-563EBFF.png)
https://github.com/hankei6km/mdast-qrcode
```

yield:

![h:200:qrcode:https://github.com/hankei6km/mdast-qrcode](mdast-qrcode-color_dark-2563EBFF.png)
https://github.com/hankei6km/mdast-qrcode

---

## QR code (error creection level = H)

source:

```markdown
![h:200:qrcode:https://github.com/hankei6km/mdast-qrcode](mdast-qrcode-color_dark-563EBFF-eclevel-H.png)
https://github.com/hankei6km/mdast-qrcode
```

yield:

![h:200:qrcode:https://github.com/hankei6km/mdast-qrcode](mdast-qrcode-color_dark-2563EBFF-eclevel-H.png)
https://github.com/hankei6km/mdast-qrcode
