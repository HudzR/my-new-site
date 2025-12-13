document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quoteForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbweJwbLmhNyY_yLg6B0O1JrF8GrohzFccB6wDnYJmdLoGT-r9q3uxmVs52Pz2Tx0M4/exec';

    successMessage.style.display = 'none';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                tvSize: document.getElementById('tvSize').value.trim(),
                wallType: document.getElementById('wallType').value,
                underFireplace: document.querySelector('input[name="underFireplace"]:checked').value,
                bracketType: document.getElementById('bracketType').value,
                address: document.getElementById('address').value.trim(),
                cableManagement: document.querySelector('input[name="cableManagement"]:checked').value,
                additionalServices: document.querySelector('input[name="additionalServices"]:checked').value
            };

            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                mode: 'no-cors' // Добавляем режим no-cors для Google Apps Script
            });

            // Для режима no-cors мы не можем прочитать response, поэтому предполагаем успех
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get Free Quote';
        }
    });

    function validateForm() {
        let isValid = true;
        
        // Сбросить все сообщения об ошибках
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });

        // Проверка обязательных полей
        const requiredFields = [
            {id: 'name', error: 'name-error'},
            {id: 'phone', error: 'phone-error'},
            {id: 'tvSize', error: 'tvSize-error'},
            {id: 'wallType', error: 'wallType-error'},
            {id: 'bracketType', error: 'bracketType-error'},
            {id: 'address', error: 'address-error'}
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorElement = document.getElementById(field.error);
            
            if (!input.value.trim()) {
                errorElement.style.display = 'block';
                isValid = false;
            }
        });

        return isValid;
    }
});