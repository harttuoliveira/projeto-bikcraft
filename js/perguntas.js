(function () {
  document.documentElement.classList.add('js');

  const questionHeaders = document.querySelectorAll('.perguntas dt');

  if (!questionHeaders.length) return;

  const toggleQuestion = (dt, dd) => {
    const isOpen = dt.classList.contains('ativo');
    dt.classList.toggle('ativo', !isOpen);
    dd.classList.toggle('ativo', !isOpen);
    dt.setAttribute('aria-expanded', String(!isOpen));
    dd.setAttribute('aria-hidden', String(isOpen));
    dd.style.maxHeight = !isOpen ? `${dd.scrollHeight}px` : '0px';
  };

  const handleResize = () => {
    questionHeaders.forEach((dt) => {
      const dd = dt.nextElementSibling;
      if (!(dd instanceof HTMLElement)) return;
      if (dt.classList.contains('ativo')) {
        dd.style.maxHeight = `${dd.scrollHeight}px`;
      }
    });
  };

  questionHeaders.forEach((dt) => {
    const dd = dt.nextElementSibling;
    if (!(dd instanceof HTMLElement)) return;

    dt.tabIndex = 0;
    dt.setAttribute('aria-expanded', 'false');
    dd.setAttribute('aria-hidden', 'true');
    dd.style.maxHeight = '0px';

    dt.addEventListener('click', () => toggleQuestion(dt, dd));
    dt.addEventListener('keydown', (event) => {
      const isActivationKey = event.key === 'Enter' || event.key === ' ';
      if (!isActivationKey) return;
      event.preventDefault();
      toggleQuestion(dt, dd);
    });
  });

  window.addEventListener('resize', handleResize);
})();