// data-loader.js - Helper để load data theo ngôn ngữ

class DataLoader {
	constructor() {
		this.cache = {};
	}

	/**
	 * Load file JSON theo ngôn ngữ hiện tại
	 * @param {string} fileName - Tên file không có extension (vd: 'tours', 'data')
	 * @returns {Promise<Object>} Data đã parse
	 */
	async loadData(fileName) {
		const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'vi';
		const cacheKey = `${fileName}-${lang}`;

		// Check cache
		if (this.cache[cacheKey]) {
			return this.cache[cacheKey];
		}

		try {
			const filePath = `./${fileName}-${lang}.json`;
			const response = await fetch(filePath);
			
			if (!response.ok) {
				// Fallback về tiếng Việt nếu không tìm thấy
				console.warn(`File ${filePath} not found, falling back to Vietnamese`);
				const fallbackPath = `./${fileName}-vi.json`;
				const fallbackResponse = await fetch(fallbackPath);
				
				if (!fallbackResponse.ok) {
					throw new Error(`Failed to load ${fallbackPath}`);
				}
				
				const data = await fallbackResponse.json();
				this.cache[cacheKey] = data;
				return data;
			}

			const data = await response.json();
			this.cache[cacheKey] = data;
			return data;
		} catch (error) {
			console.error(`Error loading ${fileName}:`, error);
			throw error;
		}
	}

	/**
	 * Load tours data
	 * @returns {Promise<Object>}
	 */
	async loadTours() {
		return this.loadData('tours');
	}

	/**
	 * Load destinations data
	 * @returns {Promise<Object>}
	 */
	async loadDestinations() {
		return this.loadData('data');
	}

	/**
	 * Clear cache (dùng khi chuyển ngôn ngữ)
	 */
	clearCache() {
		this.cache = {};
	}

	/**
	 * Reload data khi chuyển ngôn ngữ
	 * @param {string} fileName
	 * @returns {Promise<Object>}
	 */
	async reloadData(fileName) {
		const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'vi';
		const cacheKey = `${fileName}-${lang}`;
		delete this.cache[cacheKey];
		return this.loadData(fileName);
	}
}

// Export singleton instance
const dataLoader = new DataLoader();

// Make it available globally
window.dataLoader = dataLoader;

// Subscribe to language changes để clear cache
if (window.i18n) {
	window.i18n.subscribe(() => {
		dataLoader.clearCache();
	});
}
