<script>
import { longBtcFormat, integerFormat } from '../utils/format.js'
import { exchangeRates, localCurrency } from '../stores.js'
import { formatCurrency } from '../utils/fx.js'

export let tx
export let position

let clampedX
let clampedY
let above = false
$: clampedX = Math.max(20, Math.min(position.x - 30, window.innerWidth - 300))
$: clampedY = Math.max(50, Math.min(position.y, window.innerHeight - 30))
$: {
  above = position.y > (window.innerHeight / 2)
}

let formattedLocalValue

$: {
  if (tx && tx.value) {
    const rate = $exchangeRates[$localCurrency]
    let local
    if (rate && rate.last) {
      formattedLocalValue = formatCurrency($localCurrency, (tx.value/100000000) * rate.last, { compact: true })
    } else {
      formattedLocalValue = null
    }
  }
}

function formatBTC (sats) {
  return `₿ ${longBtcFormat.format(sats/100000000)}`
}
</script>

<style type="text/scss">
  .tx-info {
    position: fixed;
    z-index: 50;
    width: 300px;
    display: block;
    pointer-events: all;
    box-sizing: border-box;
    transform: translateY(20px);

    background: var(--palette-d);
    color: var(--palette-x);
    padding: .5rem;

    font-size: 0.8rem;
    text-align: left;

    &.above {
      transform: translateY(calc(-100% - 20px));
    }

    .field {
      margin: 0;
      line-height: 1.4em;
    }

    .local-value {
      white-space: nowrap;
    }

    .hash {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .coinbase {
      white-space: pre-wrap;
      word-break: break-all;
    }

    &:hover {
      .hash {
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }
</style>

<div class="tx-info" class:above style="left: {clampedX}px; top: {clampedY}px">
  <p class="field hash">
    TxID: { tx.id }
  </p>
  {#if tx.inputs && !tx.coinbase }<p class="field inputs">{ tx.inputs.length } input{#if tx.inputs.length != 1}s{/if}</p>
  {:else if tx.coinbase }
    <p class="field coinbase">Coinbase: { tx.coinbase.sigAscii }</p>
  {/if}
  {#if tx.outputs }<p class="field outputs">{ tx.outputs.length } output{#if tx.outputs.length != 1}s{/if}</p>{/if}
  <p class="field vbytes">{ integerFormat.format(tx.vbytes) } vbytes</p>
  <p class="field value">
    Total value: { formatBTC(tx.value) }
    {#if formattedLocalValue != null }
      <span class="local-value">≈ { formattedLocalValue }</span>
    {/if}
  </p>

</div>
