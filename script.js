document.addEventListener('DOMContentLoaded', function () {
  function addLeadingZeros(value) {
    let stringValue = value.toString();
    while (stringValue.length < 4) {
      stringValue = '0' + stringValue;
    }
    return stringValue;
  }

  // Generator bovenin
  function updateResult() {
    const selects = document.querySelectorAll('.docNameSelection');
    const values = [];

    selects.forEach(select => {
      values.push(select.value);
    });

    const numberInput = document.getElementById('numberInput');
    let numberInputValue = numberInput ? numberInput.value : '';

    if (numberInputValue) {
      numberInputValue = addLeadingZeros(numberInputValue);
      values.push(numberInputValue);
    }

    const result = values.join('-');
    const out = document.getElementById('name-generator-text');
    if (out) {
      out.textContent = result;
    }
  }

  // Alle selects → update naam
  document.querySelectorAll('.docNameSelection').forEach(select => {
    select.addEventListener('change', updateResult);
  });

  // Volgnummer → update naam
  const numberInput = document.getElementById('numberInput');
  if (numberInput) {
    numberInput.addEventListener('change', updateResult);
    numberInput.addEventListener('input', updateResult);
  }

  // Reverse: bestandsnaam → tekstuele ontleding
  function parseFilename() {
    const input = document.getElementById('filenameInput');
    const output = document.getElementById('reverseResult');
    if (!input || !output) return;

    const raw = input.value.trim();
    output.innerHTML = '';
    if (!raw) return;

    // Pad en extensie strippen
    const base = raw.split(/[\\/]/).pop();
    const nameWithoutExt = base.split('.').slice(0, -1).join('.') || base;

    // Delen splitsen op '-'
    const tokens = nameWithoutExt
      .split('-')
      .map(t => t.trim())
      .filter(Boolean);

    if (tokens.length === 0) return;

    const selects = Array.from(document.querySelectorAll('.docNameSelection'));

    const seen = new Set();
    const matches = [];

    tokens.forEach(tok => {
      const upperTok = tok.toUpperCase();

      selects.forEach(select => {
        Array.from(select.options).forEach(opt => {
          const val = (opt.value || '').toString().toUpperCase();
          if (!val) return;

          if (val === upperTok) {
            const abbr = opt.value;
            const fullName = opt.label || opt.textContent || '';
            const key = abbr + '|' + fullName;

            if (!seen.has(key)) {
              seen.add(key);
              matches.push({ abbr, fullName });
            }
          }
        });
      });
    });

    if (matches.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Geen herkenbare onderdelen gevonden.';
      output.appendChild(p);
      return;
    }

    const frag = document.createDocumentFragment();
    matches.forEach(({ abbr, fullName }) => {
      const p = document.createElement('p');
      p.textContent = abbr + ' → ' + fullName;
      frag.appendChild(p);
    });
    output.appendChild(frag);
  }

  const filenameInput = document.getElementById('filenameInput');
  if (filenameInput) {
    filenameInput.addEventListener('input', parseFilename);
  }

  // Copy-to-clipboard knop
  const copyButton = document.getElementById('btn-copy-to-clipboard');
  if (copyButton) {
    copyButton.addEventListener('click', function () {
      const elem = document.getElementById('name-generator-text');
      const textToCopy = elem ? elem.innerText : '';
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(function () {
            console.log('Text copied to clipboard successfully!');
          })
          .catch(function (error) {
            console.error('Error copying text: ', error);
          });
      } else {
        const temp = document.createElement('textarea');
        temp.value = textToCopy;
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand('copy');
        } catch (e) {
          console.error('Fallback copy failed', e);
        }
        document.body.removeChild(temp);
      }
    });
  }

  // Initiale naam opbouwen
  updateResult();
});
