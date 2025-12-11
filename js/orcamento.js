(function () {
  document.documentElement.classList.add('js');

  const typeRadios = document.querySelectorAll('[name="tipo"]');
  const productSections = {
    bikcraft: document.getElementById('orcamento-bikcraft'),
    seguro: document.getElementById('orcamento-seguro'),
  };

  if (!typeRadios.length) return;

  const syncProductDetails = (section) => {
    const productRadios = section.querySelectorAll('input[name="produto"]');

    productRadios.forEach((radio) => {
      const detailWrapper = radio.nextElementSibling?.nextElementSibling;
      const isVisible = radio.checked;

      if (detailWrapper instanceof HTMLElement) {
        detailWrapper.hidden = !isVisible;
        detailWrapper.classList.toggle('ativo', isVisible);
        detailWrapper.setAttribute('aria-hidden', String(!isVisible));
      }
    });
  };

  const ensureFirstProduct = (section) => {
    const checkedProduct = section.querySelector('input[name="produto"]:checked');
    if (checkedProduct) {
      syncProductDetails(section);
      return;
    }

    const firstProduct = section.querySelector('input[name="produto"]');
    if (!firstProduct) return;

    firstProduct.checked = true;
    syncProductDetails(section);
  };

  const toggleSections = (selectedType) => {
    Object.entries(productSections).forEach(([type, section]) => {
      if (!(section instanceof HTMLElement)) return;
      const isActive = type === selectedType;
      section.hidden = !isActive;
      section.setAttribute('aria-expanded', String(isActive));
      if (isActive) ensureFirstProduct(section);
    });
  };

  const selectFromParams = () => {
    const params = new URLSearchParams(window.location.search);
    const tipoParam = params.get('tipo');
    const produtoParam = params.get('produto');

    if (tipoParam && tipoParam in productSections) {
      const matchedTypeRadio = document.querySelector(
        `[name="tipo"][value="${tipoParam}"]`
      );
      if (matchedTypeRadio instanceof HTMLInputElement) {
        matchedTypeRadio.checked = true;
      }
    }

    const selectedType = document.querySelector('[name="tipo"]:checked');
    if (!(selectedType instanceof HTMLInputElement)) return;

    toggleSections(selectedType.value);

    if (!produtoParam) return;

    const productRadio = productSections[selectedType.value]?.querySelector(
      `[name="produto"][value="${produtoParam}"]`
    );

    if (productRadio instanceof HTMLInputElement) {
      productRadio.checked = true;
      syncProductDetails(productSections[selectedType.value]);
    }
  };

  typeRadios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      if (!(event.target instanceof HTMLInputElement)) return;
      toggleSections(event.target.value);
    });
  });

  Object.values(productSections).forEach((section) => {
    if (!(section instanceof HTMLElement)) return;
    const productRadios = section.querySelectorAll('input[name="produto"]');

    productRadios.forEach((radio) => {
      radio.addEventListener('change', () => syncProductDetails(section));
    });
  });

  const initialType = document.querySelector('[name="tipo"]:checked');
  let initialValue = initialType instanceof HTMLInputElement ? initialType.value : null;

  if (!initialValue && typeRadios[0] instanceof HTMLInputElement) {
    typeRadios[0].checked = true;
    initialValue = typeRadios[0].value;
  }

  toggleSections(initialValue || 'bikcraft');
  selectFromParams();
})();