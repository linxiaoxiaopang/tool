import Vue from 'vue'
import router from '../router'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { getUUID } from '@/utils'

const sentryMappingList = {
  localdev: 'https://527ab7292296496a91790f66e3460a0b@sentry.forudesigns.cn/2',
  pet: 'https://eec40ce4bcda4bb397eb79126e36f78f@sentry.forudesigns.cn/3',
  sit: 'https://6bf6bfcc17f3463db61a2bc8d239e617@sentry.forudesigns.cn/4',
  test: 'https://c16b33ec8c0548ca8ea7e69fead71d01@sentry.forudesigns.cn/5',
  uat: 'https://cf28fd81efd74ef59ae477d2438664bc@sentry.forudesigns.cn/6',
  prd: 'https://ad17e36ef2407569fc7ba5906f08a6d3@sentry.zhengdingyunshang.com/2',
  pro: 'https://ad17e36ef2407569fc7ba5906f08a6d3@sentry.zhengdingyunshang.com/2',
  newprd: 'https://ad17e36ef2407569fc7ba5906f08a6d3@sentry.zhengdingyunshang.com/2',
  sandbox: 'https://6f634fc848ea8044b7ffd9e7a00e3793@sentry.zhengdingyunshang.com/4'
}

const stage = process.env.VUE_APP_ENV_STAGE
const needSentry = ['localdev', 'pet', 'sit', 'test', 'uat', 'prd', 'pro', 'newprd', 'sandbox'].includes(stage)

const isProduction = process.env.NODE_ENV === 'production'

if (needSentry && isProduction) {
  Sentry.init({
    Vue,
    dsn: sentryMappingList[stage],
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: [process.env.VUE_APP_BASE_URL]
      })
    ],
    beforeSend(event, hint) {
      const error = hint.originalException || {}
      Sentry.configureScope(function (scope) {
        scope.setLevel('error')
      })
      if (error && error.message && error.detailMessage) {
        event.exception.values[0].value = `message: ${error.message}\n detailMessage: ${error.detailMessage}`
      }
      event.tags.traceId = error.traceId
      return event
    },
    tracesSampleRate: 1.0
  })
  Sentry.setTag('traceId', getUUID().replace(/-/g, ''))
}
