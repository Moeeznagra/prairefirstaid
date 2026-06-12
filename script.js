document.addEventListener('DOMContentLoaded', () => {
    
    // Change navbar styling on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        handleScroll(); // Check scroll on page load
        window.addEventListener('scroll', handleScroll);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Pre-select course in the contact form when clicking a course card button
    const selectCourseBtns = document.querySelectorAll('.btn-select-course');
    const courseSelectDropdown = document.getElementById('courseSelection');

    selectCourseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseName = e.target.getAttribute('data-course');
            
            // Set the dropdown value
            if (courseSelectDropdown) {
                Array.from(courseSelectDropdown.options).forEach(option => {
                    if (option.value === courseName) {
                        option.selected = true;
                    }
                });
            }

            // Scroll to contact form
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Web3Forms AJAX submission
    const form = document.getElementById('bookingForm');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                if (result.success) {
                    collapseFormWithMessage(
                        '🎉',
                        'Inquiry Sent!',
                        'Thanks for reaching out. We\'ll be in touch shortly to coordinate your session.',
                        'success'
                    );
                } else {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    showInlineError('Something went wrong. Please try again or email us directly.');
                }
            } catch (err) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showInlineError('Network error. Please check your connection and try again.');
            }
        });
    }

    function collapseFormWithMessage(icon, heading, message, type) {
        const wrapper = form.closest('.contact-form-wrapper');

        // Fade out the form
        form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        form.style.opacity = '0';
        form.style.transform = 'translateY(-8px)';

        setTimeout(() => {
            form.style.display = 'none';

            const isSuccess = type === 'success';
            const card = document.createElement('div');
            card.id = 'formSuccessCard';
            card.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
                padding: 48px 32px;
                border-radius: 16px;
                text-align: center;
                background: ${isSuccess ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'};
                border: 1px solid ${isSuccess ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'};
                animation: fadeInUp 0.5s ease forwards;
            `;

            card.innerHTML = `
                <div style="font-size: 3rem; line-height: 1;">${icon}</div>
                <h3 style="margin: 0; font-size: 1.5rem; color: ${isSuccess ? '#16a34a' : '#dc2626'};">${heading}</h3>
                <p style="margin: 0; color: #6b7280; font-size: 0.95rem; max-width: 300px; line-height: 1.6;">${message}</p>
            `;

            wrapper.appendChild(card);
        }, 400);
    }

    function showInlineError(message) {
        const existing = document.getElementById('formInlineError');
        if (existing) existing.remove();

        const msg = document.createElement('p');
        msg.id = 'formInlineError';
        msg.textContent = '❌ ' + message;
        msg.style.cssText = `
            margin-top: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            background: rgba(239,68,68,0.1);
            color: #dc2626;
            border: 1px solid rgba(239,68,68,0.3);
        `;
        form.appendChild(msg);
    }

});

