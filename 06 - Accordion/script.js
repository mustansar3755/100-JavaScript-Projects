const header = document.querySelectorAll('.accordion-header');

header.forEach(header => {
    header.addEventListener('click', () => {
        const openHeader = document.querySelector('.accordion-header.active');

        if (openHeader && openHeader !== header) {
            openHeader.classList.remove('active');

            const openContent = openHeader.nextElementSibling;

            openContent.style.maxHeight = null;

            openContent.classList.remove('open');
        }

        header.classList.toggle('active');

        const content = header.nextElementSibling;

        if (header.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';

            content.classList.add('open');
        }
        else {
            content.style.maxHeight = null;

            content.classList.remove('open');
        }
    })
})