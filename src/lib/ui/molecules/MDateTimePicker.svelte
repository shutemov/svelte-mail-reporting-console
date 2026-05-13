<script lang="ts">
  import {
    addMonths,
    buildCalendarDays,
    formatDateText,
    formatMonthYear,
    getCurrentDateTimeInputValue,
    getCurrentMonthCursor,
    parseDateText,
    parseDateTimeInputValue,
    parseTimeText,
    startOfMonth,
    weekdayLabels
  } from '$lib/common/date-time';

  export let name = '';
  export let value = '';

  let dateText = '';
  let timeText = '';
  let open = false;
  let monthCursor = getCurrentMonthCursor();
  let lastIncomingValue = '';

  $: {
    if (value !== lastIncomingValue) {
      lastIncomingValue = value;
      applyIncomingValue(value);
    }
  }

  $: selectedYmd = parseDateText(dateText);
  $: receivedAtValue = selectedYmd && parseTimeText(timeText) ? `${selectedYmd}T${timeText}` : '';
  $: calendarDays = buildCalendarDays(monthCursor);

  function applyIncomingValue(nextValue: string) {
    if (!nextValue) {
      dateText = '';
      timeText = '';
      return;
    }

    const parsed = parseDateTimeInputValue(nextValue);
    if (!parsed) {
      return;
    }

    dateText = parsed.dateText;
    timeText = parsed.timeText;
    monthCursor = parsed.monthCursor;
  }

  function selectDate(date: Date) {
    dateText = formatDateText(date);
    monthCursor = startOfMonth(date);
    open = false;
  }

  function setNow() {
    const now = getCurrentDateTimeInputValue();
    dateText = now.dateText;
    timeText = now.timeText;
    monthCursor = now.monthCursor;
    open = false;
  }

  function clearValue() {
    dateText = '';
    timeText = '';
    open = false;
  }
</script>

<div class="m-date-time-picker">
  <input type="hidden" {name} value={receivedAtValue} />

  <div class="date-time-grid">
    <div class="entry-group">
      <span>Date</span>
      <div class="date-entry">
        <input
          type="text"
          value={dateText}
          placeholder="12.05.2026"
          inputmode="numeric"
          autocomplete="off"
          aria-label="Received date"
          onfocus={() => (open = true)}
          oninput={(event) => (dateText = event.currentTarget.value)}
        />
        <button
          type="button"
          class="calendar-toggle"
          aria-label="Toggle calendar"
          aria-expanded={open}
          onclick={() => (open = !open)}
        >
          <span></span>
        </button>
      </div>
    </div>

    <div class="entry-group">
      <span>Time</span>
      <input
        class="time-entry"
        type="text"
        value={timeText}
        placeholder="14:30"
        inputmode="numeric"
        autocomplete="off"
        maxlength="5"
        aria-label="Received time"
        onfocus={() => (open = false)}
        oninput={(event) => (timeText = event.currentTarget.value)}
      />
    </div>
  </div>

  {#if open}
    <div class="calendar-panel" role="dialog" aria-label="Received date calendar">
      <div class="calendar-head">
        <button type="button" aria-label="Previous month" onclick={() => (monthCursor = addMonths(monthCursor, -1))}>
          <span></span>
        </button>
        <strong>{formatMonthYear(monthCursor)}</strong>
        <button type="button" aria-label="Next month" onclick={() => (monthCursor = addMonths(monthCursor, 1))}>
          <span></span>
        </button>
      </div>

      <div class="calendar-grid">
        {#each weekdayLabels as weekday}
          <span class="weekday">{weekday}</span>
        {/each}
        {#each calendarDays as day (day.ymd)}
          <button
            type="button"
            class:outside={!day.inMonth}
            class:selected={day.ymd === selectedYmd}
            onclick={() => selectDate(day.date)}
          >
            {day.label}
          </button>
        {/each}
      </div>

      <div class="calendar-actions">
        <button type="button" onclick={clearValue}>Clear</button>
        <button type="button" onclick={setNow}>Now</button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .m-date-time-picker {
    position: relative;
    display: grid;
    gap: 0.5rem;
  }

  .date-time-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(8.5rem, 0.38fr);
    gap: 0.5rem;
  }

  .entry-group {
    display: grid;
    gap: 0.25rem;

    > span {
      color: var(--text-muted);
      font-size: 0.75rem;
    }
  }

  .date-entry {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 2.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: white;
    transition:
      border-color 140ms ease,
      box-shadow 140ms ease;

    &:focus-within {
      border-color: var(--admin-primary);
      box-shadow: var(--shadow-focus);
    }
  }

  input {
    width: 100%;
    min-height: 2.75rem;
    border: 0;
    border-radius: var(--radius-sm);
    padding: 0.625rem 0.75rem;
    background: white;
    color: var(--text);

    &::placeholder {
      color: color-mix(in srgb, var(--text-muted) 76%, white);
    }

    &:focus {
      outline: none;
    }
  }

  .time-entry {
    border: 1px solid var(--border);
    transition:
      border-color 140ms ease,
      box-shadow 140ms ease;

    &:focus {
      border-color: var(--admin-primary);
      box-shadow: var(--shadow-focus);
    }
  }

  .calendar-toggle {
    display: grid;
    place-items: center;
    border: 0;
    border-left: 1px solid var(--border);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    background: transparent;
    cursor: pointer;

    > span {
      position: relative;
      width: 1rem;
      height: 1rem;
      border: 1.5px solid var(--text-muted);
      border-radius: 0.1875rem;

      &::before {
        content: '';
        position: absolute;
        inset: 0.25rem 0 0;
        border-top: 1.5px solid var(--text-muted);
      }
    }

    &:hover {
      background: var(--admin-tint);
    }
  }

  .calendar-panel {
    position: absolute;
    z-index: 5;
    inset-block-start: calc(100% + 0.375rem);
    inset-inline-start: 0;
    width: min(100%, 22rem);
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: white;
    box-shadow: var(--shadow);
  }

  .calendar-head,
  .calendar-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .calendar-head {
    margin-bottom: 0.625rem;

    strong {
      font-size: 0.9375rem;
      font-weight: 600;
    }

    button {
      position: relative;
      width: 2rem;
      height: 2rem;
      border: 0;
      border-radius: 999px;
      background: var(--surface-raised);
      cursor: pointer;

      &:hover {
        background: var(--admin-tint);
      }

      span {
        position: absolute;
        inset: 0.6875rem;
        border-top: 1.5px solid var(--text);
        border-right: 1.5px solid var(--text);
      }

      &:first-child span {
        transform: rotate(-135deg);
      }

      &:last-child span {
        transform: rotate(45deg);
      }
    }
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.25rem;

    .weekday {
      padding: 0.25rem 0;
      color: var(--text-muted);
      font-size: 0.6875rem;
      text-align: center;
      text-transform: uppercase;
    }

    button {
      min-height: 2.125rem;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--text);
      cursor: pointer;
      font-size: 0.875rem;

      &:hover {
        background: var(--admin-tint);
        color: var(--admin-primary);
      }

      &.outside {
        color: color-mix(in srgb, var(--text-muted) 62%, white);
      }

      &.selected {
        background: var(--admin-primary);
        color: white;
        font-weight: 600;
      }
    }
  }

  .calendar-actions {
    margin-top: 0.75rem;
    padding-top: 0.625rem;
    border-top: 1px solid var(--border);

    button {
      min-height: 2rem;
      border: 0;
      border-radius: 999px;
      padding: 0.35rem 0.75rem;
      background: var(--surface-raised);
      color: var(--text);
      cursor: pointer;
      font-size: 0.8125rem;

      &:hover {
        background: var(--admin-tint);
        color: var(--admin-primary);
      }
    }
  }

  @media (max-width: 640px) {
    .date-time-grid {
      grid-template-columns: 1fr;
    }

    .calendar-panel {
      width: 100%;
    }
  }
</style>
