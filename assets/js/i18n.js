// i18n.js - Module quản lý đa ngôn ngữ

class I18n {
	constructor() {
		this.currentLang = localStorage.getItem('language') || 'vi';
		this.translations = {};
		this.observers = []; // Danh sách các callback khi ngôn ngữ thay đổi
	}

	// Load file ngôn ngữ
	async loadLanguage(lang) {
		try {
			const response = await fetch(`./assets/lang/${lang}.json`);
			if (!response.ok) {
				throw new Error(`Failed to load language: ${lang}`);
			}
			const translations = await response.json();
			this.translations[lang] = translations;
			return translations;
		} catch (error) {
			console.error('Error loading language file:', error);
			// Fallback to Vietnamese if error
			if (lang !== 'vi') {
				return this.loadLanguage('vi');
			}
			return {};
		}
	}

	// Khởi tạo i18n
	async init(lang = null) {
		const targetLang = lang || this.currentLang;
		
		// Load ngôn ngữ hiện tại
		if (!this.translations[targetLang]) {
			await this.loadLanguage(targetLang);
		}

		this.currentLang = targetLang;
		localStorage.setItem('language', targetLang);
		
		// Update HTML lang attribute
		document.documentElement.lang = targetLang;
		
		// Translate tất cả các phần tử có data-i18n
		this.translatePage();
		
		return this.translations[targetLang];
	}

	// Lấy bản dịch theo key (hỗ trợ nested key như "header.nav.home")
	t(key, params = {}) {
		const keys = key.split('.');
		let value = this.translations[this.currentLang];

		for (const k of keys) {
			if (value && typeof value === 'object') {
				value = value[k];
			} else {
				console.warn(`Translation not found for key: ${key}`);
				return key;
			}
		}

		// Replace params in translation (e.g., "Hello {name}" with params = {name: "John"})
		if (typeof value === 'string' && Object.keys(params).length > 0) {
			return value.replace(/\{(\w+)\}/g, (match, param) => {
				return params[param] !== undefined ? params[param] : match;
			});
		}

		return value || key;
	}

	// Dịch toàn bộ trang
	translatePage() {
		// Dịch các phần tử có data-i18n
		document.querySelectorAll('[data-i18n]').forEach(element => {
			const key = element.getAttribute('data-i18n');
			
			// Check if key contains attribute notation like [placeholder]key
			const attributeMatch = key.match(/^\[(\w+)\](.+)$/);
			if (attributeMatch) {
				const [, attribute, translationKey] = attributeMatch;
				const translation = this.t(translationKey);
				
				if (attribute === 'placeholder') {
					element.placeholder = translation;
				} else if (attribute === 'title') {
					element.title = translation;
				} else if (attribute === 'aria-label') {
					element.setAttribute('aria-label', translation);
				} else {
					element.setAttribute(attribute, translation);
				}
				return;
			}
			
			const translation = this.t(key);
			
			// Check nếu cần dịch placeholder (legacy support)
			if (element.hasAttribute('data-i18n-placeholder')) {
				element.placeholder = translation;
			} 
			// Check nếu cần dịch aria-label (legacy support)
			else if (element.hasAttribute('data-i18n-aria')) {
				element.setAttribute('aria-label', translation);
			}
			// Check nếu cần dịch title (legacy support)
			else if (element.hasAttribute('data-i18n-title')) {
				element.title = translation;
			}
			// Mặc định dịch textContent
			else {
				element.textContent = translation;
			}
		});

		// Thông báo cho các observers
		this.notifyObservers();
		
		// Dispatch custom event for language change
		window.dispatchEvent(new CustomEvent('languageChanged', { 
			detail: { language: this.currentLang } 
		}));
	}

	// Chuyển đổi ngôn ngữ
	async changeLanguage(lang) {
		if (lang === this.currentLang) return;

		// Load ngôn ngữ mới nếu chưa có
		if (!this.translations[lang]) {
			await this.loadLanguage(lang);
		}

		this.currentLang = lang;
		localStorage.setItem('language', lang);
		document.documentElement.lang = lang;
		
		// Dịch lại trang
		this.translatePage();
	}

	// Lấy ngôn ngữ hiện tại
	getCurrentLanguage() {
		return this.currentLang;
	}

	// Đăng ký observer để lắng nghe thay đổi ngôn ngữ
	subscribe(callback) {
		this.observers.push(callback);
	}

	// Hủy đăng ký observer
	unsubscribe(callback) {
		this.observers = this.observers.filter(observer => observer !== callback);
	}

	// Thông báo cho các observers
	notifyObservers() {
		this.observers.forEach(callback => {
			try {
				callback(this.currentLang);
			} catch (error) {
				console.error('Error in i18n observer:', error);
			}
		});
	}
}

// Export singleton instance
const i18n = new I18n();

// Make it available globally
window.i18n = i18n;
