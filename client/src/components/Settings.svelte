<script>
import config from '../config.js'
import analytics from '../utils/analytics.js'
import SidebarMenuItem from '../components/SidebarMenuItem.svelte'
import { settings, nativeAntialias, exchangeRates, localCurrency, haveMessages } from '../stores.js'

function toggle(setting) {
  $settings[setting] = !$settings[setting]
  analytics.trackEvent('settings', setting, $settings[setting] ? 'on' : 'off')
}

let settingConfig = {
  showNetworkStatus: {
    label: 'Network Status'
  },
  darkMode: {
    label: 'Dark Mode'
  },
  vbytes: {
    label: 'Size by',
    type: 'pill',
    falseLabel: 'value',
    trueLabel: 'vbytes'
  },
}
$: {
  if ($nativeAntialias) {
    settingConfig.fancyGraphics = false
  } else {
    settingConfig.fancyGraphics = {
      label: 'Fancy Graphics'
    }
  }
  if (config.messagesEnabled && $haveMessages) {
    settingConfig.showMessages = {
      label: 'Message Bar'
    }
  }
}

$: {
  const rate = $exchangeRates[$localCurrency]
  if (rate && rate.last) {
    settingConfig.showFX = {
      label: '₿ Price'
    }
  } else {
    settingConfig.showFX = false
  }
}


function getSettings(setting) {
  return settingConfig[setting] || {}
}

</script>

{#each Object.keys($settings) as setting (setting) }
  {#if settingConfig[setting]}
    <SidebarMenuItem {...getSettings(setting)} active={$settings[setting]} on:click={() => { toggle(setting) }} />
  {/if}
{/each}
