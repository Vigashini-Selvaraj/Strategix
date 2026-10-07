// js/pages.js
// Booking Page Logic for Strategix

const services = {
    "private-coaching": {
        title: "Private Coaching",
        description: "Personalized chess coaching designed around the player's current level, goals, and development areas.",
        plans: {
            single: { title: "Single Session", price: 799, sessions: 1, duration: 60 },
            monthly: { title: "Monthly", price: 2799, sessions: 4, duration: 60 },
            intensive: { title: "Intensive", price: 4999, sessions: 8, duration: 60 }
        }
    },
    "group-coaching": {
        title: "Small Group Training",
        description: "Train with players of similar rating in a structured curriculum.",
        plans: {
            monthly: { title: "Monthly Group", price: 1999, sessions: 4, duration: 90 }
        }
    }
};

const programs = {
    beginner: { title: "Beginner Chess", level: "Beginner", price: 2499, duration: 60, sessions: 4 },
    intermediate: { title: "Intermediate Chess", level: "Intermediate", price: 2999, duration: 60, sessions: 4 },
    advanced: { title: "Advanced Chess", level: "Advanced", price: 3499, duration: 90, sessions: 4 },
    tournament: { title: "Tournament Preparation", level: "Competitive", price: 4499, duration: 90, sessions: 4 },
    kids: { title: "Kids Chess Development", level: "Beginner", price: 2499, duration: 60, sessions: 4 }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if on booking page
    if (!document.getElementById('booking-form-state')) return;

    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("service");
    const programId = params.get("program");
    const planId = params.get("plan");
    
    let currentBooking = null;

    if (serviceId && services[serviceId]) {
        const s = services[serviceId];
        const p = s.plans[planId] || Object.values(s.plans)[0]; // default to first plan if none provided
        currentBooking = {
            type: 'service',
            title: s.title,
            planName: p.title,
            price: p.price,
            sessions: p.sessions,
            duration: p.duration
        };
        document.getElementById('booking-breadcrumb').innerHTML = `Services / ${s.title} / Booking`;
    } else if (programId && programs[programId]) {
        const p = programs[programId];
        currentBooking = {
            type: 'program',
            title: p.title,
            planName: p.level + ' Level',
            price: p.price,
            sessions: p.sessions,
            duration: p.duration
        };
        document.getElementById('booking-breadcrumb').innerHTML = `Programs / ${p.title} / Booking`;
    } else {
        // Invalid State
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('booking-form-state').style.display = 'none';
        document.getElementById('booking-summary-sticky').style.display = 'none';
        document.querySelector('.booking-progress-section').style.display = 'none';
        document.getElementById('booking-error-state').style.display = 'block';
        return;
    }

    // Show main content
    document.getElementById('main-content').style.display = 'block';

    // Populate Selected Training UI
    document.getElementById('selected-training-details').innerHTML = `
        <div class="booking-detail-row"><span>Training Type</span><strong>${currentBooking.title}</strong></div>
        <div class="booking-detail-row"><span>Plan</span><strong>${currentBooking.planName}</strong></div>
        <div class="booking-detail-row"><span>Sessions</span><strong>${currentBooking.sessions}</strong></div>
        <div class="booking-detail-row"><span>Session Duration</span><strong>${currentBooking.duration} Minutes</strong></div>
    `;

    // Populate Summary
    function updateSummary() {
        const format = document.getElementById('training-format-val').value;
        const date = document.getElementById('selected-date-val').value;
        const time = document.getElementById('selected-time-val').value;
        
        let html = `
            <div class="summary-item"><span>Training</span><strong>${currentBooking.title}</strong></div>
            <div class="summary-item"><span>Plan</span><strong>${currentBooking.planName}</strong></div>
            <div class="summary-item"><span>Format</span><strong>${format || '-'}</strong></div>
            <div class="summary-item"><span>Date</span><strong>${date ? formatDate(date) : '-'}</strong></div>
            <div class="summary-item"><span>Time</span><strong>${time || '-'}</strong></div>
            <div class="summary-item mt-3"><span>Plan Price</span><strong>₹${currentBooking.price}</strong></div>
        `;
        document.getElementById('summary-content').innerHTML = html;
        document.getElementById('summary-subtotal').innerText = '₹' + currentBooking.price;
        document.getElementById('summary-total').innerText = '₹' + currentBooking.price;
    }
    
    // Initial Summary
    updateSummary();

    // Format Cards Logic
    document.querySelectorAll('.format-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.format-card').forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-pressed', 'false');
            });
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
            document.getElementById('training-format-val').value = card.dataset.format;
            updateSummary();
        });
    });

    // Calendar Generation
    const today = new Date(2026, 9, 13); // Using Oct 2026 as base based on mock
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar(month, year) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById('calendar-month-year').innerText = `${monthNames[month]} ${year}`;
        
        const daysContainer = document.getElementById('calendar-days');
        daysContainer.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let emptyDays = firstDay === 0 ? 6 : firstDay - 1; // Monday start
        for (let i = 0; i < emptyDays; i++) {
            daysContainer.innerHTML += `<span></span>`;
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isPast = (year < 2026) || (year === 2026 && month < 9) || (year === 2026 && month === 9 && i < 13);
            const classList = isPast ? 'day disabled' : 'day available';
            daysContainer.innerHTML += `<button class="${classList}" data-date="${dateStr}">${i}</button>`;
        }
        
        // Add click events to available days
        document.querySelectorAll('.day.available').forEach(day => {
            day.addEventListener('click', () => {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                document.getElementById('selected-date-val').value = day.dataset.date;
                document.getElementById('error-date').style.display = 'none';
                
                // Show time slots
                document.getElementById('section-time').style.display = 'block';
                document.getElementById('selected-time-val').value = '';
                document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
                document.getElementById('time-summary').innerText = '';
                
                updateSummary();
            });
        });
    }
    
    renderCalendar(currentMonth, currentYear);
    
    document.getElementById('prev-month').addEventListener('click', () => {
        if(currentYear > 2026 || (currentYear === 2026 && currentMonth > 9)) {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar(currentMonth, currentYear);
        }
    });
    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentMonth, currentYear);
    });

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-GB', options); // 13 October 2026
    }

    // Time Selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            document.getElementById('selected-time-val').value = slot.dataset.time;
            document.getElementById('error-time').style.display = 'none';
            
            const selectedDate = document.getElementById('selected-date-val').value;
            if(selectedDate) {
                document.getElementById('time-summary').innerText = `${formatDate(selectedDate)} \n ${slot.dataset.time} - (1 hour)`;
            }
            updateSummary();
        });
    });

    // Guardian Checkbox
    const isMinor = document.getElementById('is-minor');
    isMinor.addEventListener('change', () => {
        document.getElementById('guardian-fields').style.display = isMinor.checked ? 'block' : 'none';
    });

    // Form Validation Helper
    function validateField(id, errorId) {
        const val = document.getElementById(id).value.trim();
        const field = document.getElementById(id);
        const error = document.getElementById(errorId);
        if (!val) {
            field.setAttribute('aria-invalid', 'true');
            field.parentElement.classList.add('has-error');
            error.style.display = 'block';
            return false;
        } else {
            field.removeAttribute('aria-invalid');
            field.parentElement.classList.remove('has-error');
            error.style.display = 'none';
            return true;
        }
    }

    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => {
            if(el.parentElement.classList.contains('has-error')) {
                el.parentElement.classList.remove('has-error');
                const err = el.parentElement.querySelector('.inline-error');
                if(err) err.style.display = 'none';
            }
        });
    });

    // State Transitions
    const formState = document.getElementById('booking-form-state');
    const reviewState = document.getElementById('booking-review-state');
    const paymentState = document.getElementById('booking-payment-state');
    const successState = document.getElementById('booking-success-state');
    const summarySticky = document.getElementById('booking-summary-sticky');
    
    function setStep(step) {
        document.querySelectorAll('.progress-step').forEach((el, index) => {
            if (index < step - 1) {
                el.classList.add('completed');
                el.classList.remove('active');
            } else if (index === step - 1) {
                el.classList.add('active');
                el.classList.remove('completed');
            } else {
                el.classList.remove('active');
                el.classList.remove('completed');
            }
        });
    }

    const btnContinueReview = document.getElementById('btn-continue-review');
    const btnSummaryContinue = document.getElementById('btn-summary-continue');

    function handleContinueReview() {
        let valid = true;
        
        if (!document.getElementById('selected-date-val').value) {
            document.getElementById('error-date').style.display = 'block';
            valid = false;
        }
        if (!document.getElementById('selected-time-val').value) {
            document.getElementById('error-time').style.display = 'block';
            valid = false;
        }

        valid = validateField('fname', 'error-fname') && valid;
        valid = validateField('lname', 'error-lname') && valid;
        valid = validateField('email', 'error-email') && valid;
        valid = validateField('phone', 'error-phone') && valid;
        valid = validateField('level', 'error-level') && valid;
        
        if (isMinor.checked) {
            valid = validateField('g-name', 'error-g-name') && valid;
            valid = validateField('g-phone', 'error-g-phone') && valid;
            valid = validateField('g-email', 'error-g-email') && valid;
        }

        const policyAccurate = document.getElementById('policy-accurate');
        if (!policyAccurate.checked) {
            document.getElementById('error-policy-accurate').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('error-policy-accurate').style.display = 'none';
        }

        const policyAgree = document.getElementById('policy-agree');
        if (!policyAgree.checked) {
            document.getElementById('error-policy-agree').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('error-policy-agree').style.display = 'none';
        }

        if (valid) {
            // Populate Review Data
            document.getElementById('review-training').innerHTML = `
                <p><strong>${currentBooking.title}</strong><br>${currentBooking.planName}<br>${document.getElementById('training-format-val').value}</p>
            `;
            document.getElementById('review-schedule').innerHTML = `
                <p><strong>${formatDate(document.getElementById('selected-date-val').value)}</strong><br>${document.getElementById('selected-time-val').value}</p>
            `;
            document.getElementById('review-player').innerHTML = `
                <p><strong>${document.getElementById('fname').value} ${document.getElementById('lname').value}</strong><br>${document.getElementById('email').value}<br>${document.getElementById('phone').value}<br>Level: ${document.getElementById('level').value}</p>
            `;
            
            const selectedGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(cb => cb.value);
            document.getElementById('review-goals').innerHTML = `
                <p>${selectedGoals.length > 0 ? selectedGoals.join('<br>') : 'None specified'}</p>
            `;

            formState.style.display = 'none';
            reviewState.style.display = 'block';
            window.scrollTo({top: 0, behavior: 'smooth'});
            setStep(4);
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.inline-error[style="display: block;"], .has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    btnContinueReview.addEventListener('click', handleContinueReview);
    btnSummaryContinue.addEventListener('click', handleContinueReview);

    // Edit Buttons in Review
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            reviewState.style.display = 'none';
            formState.style.display = 'block';
            setStep(3);
            const targetId = btn.dataset.target;
            setTimeout(() => {
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    });

    document.getElementById('btn-back-edit').addEventListener('click', () => {
        reviewState.style.display = 'none';
        formState.style.display = 'block';
        setStep(3);
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    document.getElementById('btn-continue-payment').addEventListener('click', () => {
        reviewState.style.display = 'none';
        summarySticky.style.display = 'none'; // hide summary on payment
        paymentState.style.display = 'block';
        
        document.getElementById('payment-plan-name').innerText = currentBooking.planName;
        document.getElementById('payment-sessions').innerText = currentBooking.sessions;
        document.getElementById('payment-total').innerText = '₹' + currentBooking.price;
        
        setStep(5);
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    document.getElementById('btn-process-payment').addEventListener('click', () => {
        const processing = document.getElementById('payment-processing');
        processing.style.display = 'block';
        document.getElementById('btn-process-payment').disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            paymentState.style.display = 'none';
            
            // Populate Success
            document.getElementById('success-program').innerText = currentBooking.title;
            document.getElementById('success-plan').innerText = currentBooking.planName;
            document.getElementById('success-date').innerText = formatDate(document.getElementById('selected-date-val').value);
            document.getElementById('success-time').innerText = document.getElementById('selected-time-val').value;
            document.getElementById('success-format').innerText = document.getElementById('training-format-val').value;

            successState.style.display = 'block';
            document.getElementById('what-happens-next').style.display = 'block';
            
            // Hide progress & faq on success
            document.querySelector('.booking-progress-section').style.display = 'none';
            document.querySelector('.layout-right').style.display = 'none';
            document.querySelector('.layout-grid').classList.add('success-mode');
            
            window.scrollTo({top: 0, behavior: 'smooth'});
        }, 2000);
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            
            // Close all
            document.querySelectorAll('.faq-question').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.nextElementSibling.hidden = true;
            });
            
            if (!expanded) {
                btn.setAttribute('aria-expanded', 'true');
                btn.nextElementSibling.hidden = false;
            }
        });
    });

    // Initial event listeners for policy checkboxes to clear errors
    document.querySelectorAll('.policy-checkbox-wrap input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            if(cb.checked) {
                cb.closest('.form-section').querySelector(`#error-${cb.id}`).style.display = 'none';
            }
        });
    });
});
