import defaultStoreSession from '@/utils/utils/sessionUtils'

const SHEET_DATA_CACHE_KEY = 'SheetData'

export class CacheSheetData {
  constructor(option = {}) {
    const {
      cacheKey = SHEET_DATA_CACHE_KEY,
      storeSession = defaultStoreSession
    } = option
    this.cacheKey = cacheKey
    this.storeSession = storeSession
  }

  update(data) {
    this.storeSession.set(this.cacheKey, data)
  }

  get() {
    return this.storeSession.get(this.cacheKey)
  }
}

export const instanceCacheSheet = new CacheSheetData()
