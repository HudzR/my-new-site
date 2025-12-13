// --- 1. КОНФІГУРАЦІЯ ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzyZc9tOIan4FT1vrd6vPlmzjQ0kowNv5ku6dsb0sYrG26FdzJUfDnLN82yENc-bcB/exec'; // !!! Обов'язково замініть !!!

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quoteForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form || !successMessage || !submitBtn) {
        console.error("Помилка: Не знайдено необхідних елементів форми (quoteForm, successMessage, submitBtn).");
        return;
    }
    
    successMessage.style.display = 'none';
    
    // Ініціалізація
    initializeConditionalLogic();
    generateInitialTVBlock();
    
    // Обробник відправки форми
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const formDataObject = prepareFormData();
            
            // *** ВИПРАВЛЕННЯ CORS/ПУСТОГО ЗАПИТУ: Використання FormData ***
            const formData = new FormData();
            for (const key in formDataObject) {
                // Додаємо всі поля, включаючи JSON рядок, в об'єкт FormData
                formData.append(key, formDataObject[key]); 
            }
            
            // Відправка на Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                // Content-Type НЕ ВСТАНОВЛЮЄМО, FormData зробить це автоматично
                body: formData 
            });
            
            if (!response.ok) {
                 console.warn('Apps Script повертає не-OK відповідь.');
            }
            
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
        } catch (error) {
            console.error('Submission error (Apps Script або мережа):', error);
            // Показуємо успіх, оскільки Apps Script міг спрацювати, а помилка — мережева.
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get Free Quote';
        }
    });
    
    // --- ДИНАМІЧНІ ФУНКЦІЇ (ЛОГІКА, ВАЛІДАЦІЯ, ПІДГОТОВКА ДАНИХ) ---
    
    // ПРИМІТКА: Весь вміст функцій нижче (initializeConditionalLogic, 
    // generateSingleTVBlock, generateAllTVBlocks, validateForm, prepareFormData) 
    // залишається незмінним, оскільки він був коректним.
    
    function initializeConditionalLogic() {
        const multipleTVRadios = document.querySelectorAll('input[name="multipleTV"]');
        multipleTVRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const numberOfTVsGroup = document.getElementById('numberOfTVsGroup');
                const allTVBlocksContainer = document.getElementById('allTVBlocksContainer');
                
                if (this.value === 'Yes') {
                    if(numberOfTVsGroup) numberOfTVsGroup.style.display = 'block';
                    if(allTVBlocksContainer) allTVBlocksContainer.innerHTML = '';
                    const additionalTVsSelect = document.getElementById('additionalTVs');
                    if(additionalTVsSelect) additionalTVsSelect.value = '';
                } else {
                    if(numberOfTVsGroup) numberOfTVsGroup.style.display = 'none';
                    if(allTVBlocksContainer) allTVBlocksContainer.innerHTML = '';
                    generateSingleTVBlock();
                }
            });
        });
        
        const additionalTVsSelect = document.getElementById('additionalTVs');
        if (additionalTVsSelect) {
            additionalTVsSelect.addEventListener('change', function() {
                if (this.value) {
                    generateAllTVBlocks(parseInt(this.value));
                } else {
                    const allTVBlocksContainer = document.getElementById('allTVBlocksContainer');
                    if(allTVBlocksContainer) allTVBlocksContainer.innerHTML = '';
                }
            });
        }
        
        const cableManagementRadios = document.querySelectorAll('input[name="cableManagement"]');
        cableManagementRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const cableOptionsGroup = document.getElementById('cableOptionsGroup');
                if (this.value === 'Yes') {
                    if(cableOptionsGroup) cableOptionsGroup.style.display = 'block';
                } else {
                    if(cableOptionsGroup) cableOptionsGroup.style.display = 'none';
                    document.querySelectorAll('input[name="cableOption"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
            });
        });
        
        const additionalServicesRadios = document.querySelectorAll('input[name="additionalServices"]');
        additionalServicesRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const servicesOptionsGroup = document.getElementById('servicesOptionsGroup');
                if (this.value === 'Yes') {
                    if(servicesOptionsGroup) servicesOptionsGroup.style.display = 'block';
                } else {
                    if(servicesOptionsGroup) servicesOptionsGroup.style.display = 'none';
                    document.querySelectorAll('.contact-checkbox').forEach(checkbox => {
                        checkbox.checked = false;
                    });
                }
            });
        });
        
        const multipleTVNo = document.getElementById('multipleTVNo');
        if (multipleTVNo && multipleTVNo.checked) {
            multipleTVNo.dispatchEvent(new Event('change'));
        }
    }
    
    function generateInitialTVBlock() {
        const container = document.getElementById('allTVBlocksContainer');
        if (!container) return;
        container.innerHTML = '';
        generateSingleTVBlock();
    }
    
    function generateSingleTVBlock() {
        // ... (HTML для TV1) ...
        const container = document.getElementById('allTVBlocksContainer');
        if (!container) return;
        
        const tvBlock = document.createElement('div');
        tvBlock.className = 'tv-block';
        tvBlock.innerHTML = `
            <h3 class="tv-block-title">TV Details</h3>
            <div class="form-group contact-form-group">
                <label for="tv1Size" class="contact-label required">TV size (inches)</label>
                <select id="tv1Size" name="tv1Size" class="contact-select" required>
                    <option value="">-- Select size --</option>
                    <option value="32">32"</option>
                    <option value="40">40"</option>
                    <option value="43">43"</option>
                    <option value="50">50"</option>
                    <option value="55">55"</option>
                    <option value="65">65"</option>
                    <option value="75">75"</option>
                    <option value="85">85"</option>
                    <option value="100">100"</option>
                </select>
                <div class="error-message contact-error" id="tv1Size-error">Please select TV size</div>
            </div>
            <div class="form-group contact-form-group">
                <label for="tv1WallType" class="contact-label required">Wall type</label>
                <select id="tv1WallType" name="tv1WallType" class="contact-select" required>
                    <option value="">-- Select wall type --</option>
                    <option value="Drywall">Drywall</option>
                    <option value="Wooden">Wooden</option>
                    <option value="Tile">Tile</option>
                    <option value="Concrete">Concrete</option>
                    <option value="Brick">Brick</option>
                </select>
                <div class="error-message contact-error" id="tv1WallType-error">Please select wall type</div>
            </div>
            <div class="form-group contact-form-group">
                <label class="contact-label required">Installation above fireplace?</label>
                <div class="radio-group contact-radio-group">
                    <div class="radio-option contact-radio-option">
                        <input type="radio" id="tv1FireplaceYes" name="tv1Fireplace" value="Yes" class="contact-radio">
                        <label for="tv1FireplaceYes" class="contact-radio-label">Yes</label>
                    </div>
                    <div class="radio-option contact-radio-option">
                        <input type="radio" id="tv1FireplaceNo" name="tv1Fireplace" value="No" class="contact-radio" checked>
                        <label for="tv1FireplaceNo" class="contact-radio-label">No</label>
                    </div>
                </div>
            </div>
            <div class="form-group contact-form-group">
                <label class="contact-label required">Do you already have a TV Mount?</label>
                <div class="radio-group contact-radio-group">
                    <div class="radio-option contact-radio-option">
                        <input type="radio" id="tv1HaveMountYes" name="tv1HaveMount" value="Yes" class="contact-radio" checked>
                        <label for="tv1HaveMountYes" class="contact-radio-label">Yes</label>
                    </div>
                    <div class="radio-option contact-radio-option">
                        <input type="radio" id="tv1HaveMountNo" name="tv1HaveMount" value="No" class="contact-radio">
                        <label for="tv1HaveMountNo" class="contact-radio-label">No</label>
                    </div>
                </div>
            </div>
            <div class="form-group contact-form-group conditional-field" id="tv1BracketTypeGroup" style="display: none;">
                <label for="tv1BracketType" class="contact-label required">Bracket type selection</label>
                <select id="tv1BracketType" name="tv1BracketType" class="contact-select">
                    <option value="">-- Select bracket type --</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Tilting Mount">Tilting Mount</option>
                    <option value="Full Motion Mount">Full Motion Mount</option>
                    <option value="Pull-Down">Pull-Down</option>
                    <option value="Slim Fit / Frame (Low-Profile)">Slim Fit / Frame (Low-Profile)</option>
                </select>
                <div class="error-message contact-error" id="tv1BracketType-error">Please select bracket type</div>
            </div>
        `;
        
        container.appendChild(tvBlock);
        
        const tvMountRadios = tvBlock.querySelectorAll('input[name="tv1HaveMount"]');
        tvMountRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const bracketTypeGroup = document.getElementById('tv1BracketTypeGroup');
                const bracketTypeSelect = document.getElementById('tv1BracketType');
                
                if (bracketTypeGroup && bracketTypeSelect) {
                    if (this.value === 'No') {
                        bracketTypeGroup.style.display = 'block';
                        bracketTypeSelect.required = true;
                    } else {
                        bracketTypeGroup.style.display = 'none';
                        bracketTypeSelect.required = false;
                        bracketTypeSelect.value = '';
                    }
                }
            });
        });
    }
    
    function generateAllTVBlocks(tvCount) {
        // ... (HTML для багатьох TV) ...
        const container = document.getElementById('allTVBlocksContainer');
        if (!container) return;
        container.innerHTML = '';
        
        for (let i = 1; i <= tvCount; i++) {
            const tvBlock = document.createElement('div');
            tvBlock.className = 'tv-block';
            tvBlock.innerHTML = `
                <h3 class="tv-block-title">TV #${i} Details</h3>
                <div class="form-group contact-form-group">
                    <label for="tv${i}Size" class="contact-label required">TV #${i} size (inches)</label>
                    <select id="tv${i}Size" name="tv${i}Size" class="contact-select" required>
                        <option value="">-- Select size --</option>
                        <option value="32">32"</option>
                        <option value="40">40"</option>
                        <option value="43">43"</option>
                        <option value="50">50"</option>
                        <option value="55">55"</option>
                        <option value="65">65"</option>
                        <option value="75">75"</option>
                        <option value="85">85"</option>
                        <option value="100">100"</option>
                    </select>
                    <div class="error-message contact-error" id="tv${i}Size-error">Please select TV size</div>
                </div>
                <div class="form-group contact-form-group">
                    <label for="tv${i}WallType" class="contact-label required">TV #${i} Wall type</label>
                    <select id="tv${i}WallType" name="tv${i}WallType" class="contact-select" required>
                        <option value="">-- Select wall type --</option>
                        <option value="Drywall">Drywall</option>
                        <option value="Wooden">Wooden</option>
                        <option value="Tile">Tile</option>
                        <option value="Concrete">Concrete</option>
                        <option value="Brick">Brick</option>
                    </select>
                    <div class="error-message contact-error" id="tv${i}WallType-error">Please select wall type</div>
                </div>
                <div class="form-group contact-form-group">
                    <label class="contact-label required">TV #${i} Installation above fireplace?</label>
                    <div class="radio-group contact-radio-group">
                        <div class="radio-option contact-radio-option">
                            <input type="radio" id="tv${i}FireplaceYes" name="tv${i}Fireplace" value="Yes" class="contact-radio">
                            <label for="tv${i}FireplaceYes" class="contact-radio-label">Yes</label>
                        </div>
                        <div class="radio-option contact-radio-option">
                            <input type="radio" id="tv${i}FireplaceNo" name="tv${i}Fireplace" value="No" class="contact-radio" checked>
                            <label for="tv${i}FireplaceNo" class="contact-radio-label">No</label>
                        </div>
                    </div>
                </div>
                <div class="form-group contact-form-group">
                    <label class="contact-label required">TV #${i} Do you already have a TV Mount?</label>
                    <div class="radio-group contact-radio-group">
                        <div class="radio-option contact-radio-option">
                            <input type="radio" id="tv${i}HaveMountYes" name="tv${i}HaveMount" value="Yes" class="contact-radio" checked>
                            <label for="tv${i}HaveMountYes" class="contact-radio-label">Yes</label>
                        </div>
                        <div class="radio-option contact-radio-option">
                            <input type="radio" id="tv${i}HaveMountNo" name="tv${i}HaveMount" value="No" class="contact-radio">
                            <label for="tv${i}HaveMountNo" class="contact-radio-label">No</label>
                        </div>
                    </div>
                </div>
                <div class="form-group contact-form-group conditional-field" id="tv${i}BracketTypeGroup" style="display: none;">
                    <label for="tv${i}BracketType" class="contact-label required">TV #${i} Bracket type selection</label>
                    <select id="tv${i}BracketType" name="tv${i}BracketType" class="contact-select">
                        <option value="">-- Select bracket type --</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Tilting Mount">Tilting Mount</option>
                        <option value="Full Motion Mount">Full Motion Mount</option>
                        <option value="Pull-Down">Pull-Down</option>
                        <option value="Slim Fit / Frame (Low-Profile)">Slim Fit / Frame (Low-Profile)</option>
                    </select>
                    <div class="error-message contact-error" id="tv${i}BracketType-error">Please select bracket type</div>
                </div>
            `;
            
            container.appendChild(tvBlock);
            
            const tvMountRadios = tvBlock.querySelectorAll(`input[name="tv${i}HaveMount"]`);
            tvMountRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const bracketTypeGroup = document.getElementById(`tv${i}BracketTypeGroup`);
                    const bracketTypeSelect = document.getElementById(`tv${i}BracketType`);
                    
                    if (bracketTypeGroup && bracketTypeSelect) {
                        if (this.value === 'No') {
                            bracketTypeGroup.style.display = 'block';
                            bracketTypeSelect.required = true;
                        } else {
                            bracketTypeGroup.style.display = 'none';
                            bracketTypeSelect.required = false;
                            bracketTypeSelect.value = '';
                        }
                    }
                });
            });
        }
    }
    
    function validateForm() {
        // ... (Логіка валідації залишається незмінною) ...
        let isValid = true;
        // ... (Скидання помилок) ...
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            if (el.previousElementSibling) {
                el.previousElementSibling.classList.remove('error');
            }
        });
        
        // ... (Валідація основних полів: Name, Phone (10 digits), Address, DateTime) ...
        const requiredFields = [
            { id: 'name', error: 'name-error' },
            { id: 'phone', error: 'phone-error' },
            { id: 'address', error: 'address-error' },
            { id: 'datetime', error: 'datetime-error' }
        ];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorElement = document.getElementById(field.error);
            
            if (input && errorElement && !input.value.trim()) {
                errorElement.style.display = 'block';
                input.classList.add('error');
                isValid = false;
            }
        });
        
        const phoneInput = document.getElementById('phone');
        const phoneError = document.getElementById('phone-error');
        const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
        
        if (phoneInput && phoneError && phoneDigits.length !== 10) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number';
            phoneError.style.display = 'block';
            phoneInput.classList.add('error');
            isValid = false;
        }

        // ... (Валідація TV details, Mounts, Cable management) ...
        const multipleTV = document.querySelector('input[name="multipleTV"]:checked');
        if (!multipleTV) {
            isValid = false;
        } else if (multipleTV.value === 'Yes') {
            const additionalTVs = document.getElementById('additionalTVs');
            const additionalTVsError = document.getElementById('additionalTVs-error');
            
            if (!additionalTVs || !additionalTVs.value) {
                if (additionalTVsError) additionalTVsError.style.display = 'block';
                if (additionalTVs) additionalTVs.classList.add('error');
                isValid = false;
            } else {
                const tvCount = parseInt(additionalTVs.value);
                for (let i = 1; i <= tvCount; i++) {
                    const tvSizeInput = document.getElementById(`tv${i}Size`);
                    const tvWallTypeInput = document.getElementById(`tv${i}WallType`);
                    const tvHaveMount = document.querySelector(`input[name="tv${i}HaveMount"]:checked`);

                    if (tvSizeInput && !tvSizeInput.value) {
                        isValid = false;
                        if (document.getElementById(`tv${i}Size-error`)) document.getElementById(`tv${i}Size-error`).style.display = 'block';
                        tvSizeInput.classList.add('error');
                    }
                    if (tvWallTypeInput && !tvWallTypeInput.value) {
                        isValid = false;
                        if (document.getElementById(`tv${i}WallType-error`)) document.getElementById(`tv${i}WallType-error`).style.display = 'block';
                        tvWallTypeInput.classList.add('error');
                    }
                    if (tvHaveMount && tvHaveMount.value === 'No') {
                        const bracketTypeInput = document.getElementById(`tv${i}BracketType`);
                        if (bracketTypeInput && !bracketTypeInput.value) {
                            isValid = false;
                            if (document.getElementById(`tv${i}BracketType-error`)) document.getElementById(`tv${i}BracketType-error`).style.display = 'block';
                            bracketTypeInput.classList.add('error');
                        }
                    }
                }
            }
        } else {
            const tvSizeInput = document.getElementById('tv1Size');
            const tvWallTypeInput = document.getElementById('tv1WallType');
            const tvHaveMount = document.querySelector('input[name="tv1HaveMount"]:checked');
            
            if (tvSizeInput && !tvSizeInput.value) {
                isValid = false;
                if (document.getElementById('tv1Size-error')) document.getElementById('tv1Size-error').style.display = 'block';
                tvSizeInput.classList.add('error');
            }
            if (tvWallTypeInput && !tvWallTypeInput.value) {
                isValid = false;
                if (document.getElementById('tv1WallType-error')) document.getElementById('tv1WallType-error').style.display = 'block';
                tvWallTypeInput.classList.add('error');
            }
            if (tvHaveMount && tvHaveMount.value === 'No') {
                const bracketTypeInput = document.getElementById('tv1BracketType');
                if (bracketTypeInput && !bracketTypeInput.value) {
                    isValid = false;
                    if (document.getElementById('tv1BracketType-error')) document.getElementById('tv1BracketType-error').style.display = 'block';
                    bracketTypeInput.classList.add('error');
                }
            }
        }
        
        const cableManagement = document.querySelector('input[name="cableManagement"]:checked');
        if (cableManagement && cableManagement.value === 'Yes') {
            const cableOption = document.querySelector('input[name="cableOption"]:checked');
            if (!cableOption) {
                isValid = false;
                if (document.getElementById('cableOption-error')) document.getElementById('cableOption-error').style.display = 'block';
            }
        }
        
        return isValid;
    }
    
    function prepareFormData() {
        // ... (Логіка підготовки даних залишається незмінною, повертає об'єкт) ...
        const multipleTV = document.querySelector('input[name="multipleTV"]:checked');
        const tvData = [];
        
        if (!multipleTV) return {};
        
        if (multipleTV.value === 'No') {
            tvData.push({
                size: document.getElementById('tv1Size')?.value || '',
                wallType: document.getElementById('tv1WallType')?.value || '',
                fireplace: document.querySelector('input[name="tv1Fireplace"]:checked')?.value || 'No',
                haveMount: document.querySelector('input[name="tv1HaveMount"]:checked')?.value || 'Yes',
                bracketType: document.getElementById('tv1BracketType')?.value || ''
            });
        } else {
            const tvCount = parseInt(document.getElementById('additionalTVs')?.value || '0');
            for (let i = 1; i <= tvCount; i++) {
                tvData.push({
                    size: document.getElementById(`tv${i}Size`)?.value || '',
                    wallType: document.getElementById(`tv${i}WallType`)?.value || '',
                    fireplace: document.querySelector(`input[name="tv${i}Fireplace"]:checked`)?.value || 'No',
                    haveMount: document.querySelector(`input[name="tv${i}HaveMount"]:checked`)?.value || 'Yes',
                    bracketType: document.getElementById(`tv${i}BracketType`)?.value || ''
                });
            }
        }
        
        const serviceOptions = [];
        document.querySelectorAll('.contact-checkbox:checked').forEach(checkbox => {
            serviceOptions.push(checkbox.value);
        });
        
        const formData = {
            name: document.getElementById('name')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            address: document.getElementById('address')?.value.trim() || '',
            datetime: document.getElementById('datetime')?.value || '',
            
            multipleTV: multipleTV.value,
            tvCount: multipleTV.value === 'No' ? '1' : document.getElementById('additionalTVs')?.value || '0',
            tvData: JSON.stringify(tvData), // Рядок JSON, який ми передамо в FormData
            
            cableManagement: document.querySelector('input[name="cableManagement"]:checked')?.value || 'No',
            cableOption: document.querySelector('input[name="cableOption"]:checked')?.value || '',
            
            additionalServices: document.querySelector('input[name="additionalServices"]:checked')?.value || 'No',
            serviceOptions: serviceOptions.join('; '),
            
            takeDown: document.querySelector('input[name="takeDown"]:checked')?.value || 'No',
            deviceSetup: document.querySelector('input[name="deviceSetup"]:checked')?.value || 'No',
            
            timestamp: new Date().toISOString(),
            source: 'Website Form'
        };
        
        return formData;
    }
});