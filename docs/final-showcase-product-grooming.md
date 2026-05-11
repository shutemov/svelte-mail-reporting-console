# Final Showcase Product Grooming

Дата: 2026-05-11.

## 1. Контекст проекта

Проект - SvelteKit MVP для консоли подозрительных писем:

```txt
Employee reports suspicious email
-> Admin triages alert
-> Admin assigns follow-up learning when risk is confirmed
-> Employee completes learning
-> Dashboard metrics update
```

После MVP проект расширен двумя слоями:

- `Simulation Feed` создает реалистичный поток синтетических репортов и позволяет измерять качество триажа.
- `Employee Risk Profiles` добавляет человеческий и организационный контекст: кто репортит, кто чаще совершает рискованные действия, где нужен follow-up learning.

Итоговая легенда showcase должна звучать не как "форма + админка", а как мини-продукт для security operations:

> Компания получает поток подозрительных писем. Сотрудники репортят письма вручную или через симуляцию. Админ видит очередь, принимает решения, система измеряет нагрузку и качество решений против скрытой ground truth, а обучение закрывает петлю изменения поведения сотрудников.

## 2. Короткая оценка текущего решения

Статус: **условно ок для технического proof-of-work, но финальный showcase требует продуктовой сборки вокруг легенды и нескольких UX/SvelteKit правок**.

Что уже хорошо:

- Основной домен читается: reports, alerts, timeline, learning, dashboard, roles.
- Слои в целом правильные: `$lib/domains`, `$lib/server`, `$lib/ui`, routes как composition boundary.
- Есть route-level form actions, серверная Zod-валидация, command-based lifecycle и server-side RBAC.
- Симуляция уже имеет конфиг, start/pause/inject/reset, hidden `groundTruth`, метрики очереди и качества решений.
- Профили сотрудников добавляют нужный продуктовый слой поверх событий и симуляции.
- `/admin` уже похож на cockpit: dashboard + employee risk + simulation controls.

Главные проблемы:

- Симуляция мутирует состояние из `load` через `tickSimulation`. Для пользователя это означает: просмотр или обновление страницы может создать новые алерты. Для SvelteKit это тоже плохая практика: `load` должен быть чистым.
- Админские действия на alert details показываются все сразу, даже если переход невозможен. Сейчас сервер защитит данные, но UX учит пользователя тыкать в ошибки.
- Ground truth скрыта правильно, но сама легенда "мы меряем решения против скрытой истины" почти не объяснена в интерфейсе.
- Метрики качества есть, но мало связаны с конкретными решениями: false negative/false positive выглядят как числа без истории.
- Форма настроек симуляции с `use:enhance` считает любой `result.type === 'success'` сохранением, даже если сервер вернул `{ success: false }` без `fail(...)`.
- Ошибки разных форм на `/admin` смешиваются через один `formError`: ошибка `Start` может отобразиться рядом с настройками flow и наоборот.
- Reporter filter принимает `reporterId` руками. Для showcase это выглядит технично, а не продуктово.
- Employee profiles частично включены только для Alice/Bob, остальные карточки summary-only. Это можно объяснить как pilot, но сейчас выглядит случайным ограничением.

## 3. Рекомендуемая финальная продуктовая история

Финальный showcase лучше строить вокруг одного сценария:

1. Admin открывает cockpit и видит состояние организации: открытые алерты, входящий поток, high-risk reports, learning completion, employee risk profiles.
2. Admin запускает simulation. Очередь начинает расти, в метриках появляется нагрузка за последние 15 минут.
3. Admin открывает alert queue, фильтрует high/critical или risky action, берет алерт в работу.
4. В alert details admin видит только данные, которые были бы доступны в реальном триаже: письмо, reporter context, рискованные действия, timeline. Ground truth не показывается.
5. Admin резолвит алерт как safe или malicious. На simulation page/cockpit обновляются decision accuracy, false negatives, precision/recall.
6. Для malicious high/critical alert admin назначает learning.
7. Employee переключается в свою роль, видит learning task, завершает module.
8. Admin возвращается в cockpit и видит, что learning completion и employee risk context изменились.

Такой сценарий продает не дизайн, а продуктовую ценность:

- очередь под нагрузкой;
- объяснимый триаж;
- измеримое качество решений;
- человеческий контекст;
- обучение как follow-up, а не декоративная фича.

## 4. Админ-панель: что улучшить продуктово

### 4.1 Cockpit как главная точка входа

`/admin` должен быть главным экраном финального showcase, а `/admin/simulation` - углубленным экраном для настройки и анализа.

Рекомендации:

- В верхней части cockpit добавить короткий operational status: `Simulation running`, `4/min`, `60% malicious`, `12 generated today`.
- Сгруппировать метрики в смысловые блоки:
  - Queue health: open alerts, incoming last 15m, backlog growth, oldest open.
  - Triage quality: accuracy, false negatives, precision/recall.
  - Human risk loop: high-risk reports, learning assigned, learning completed.
- Сделать metric cards кликабельными там, где есть очевидный drill-down:
  - `Open alerts` -> `/admin/alerts?status=new` или `status=investigating`.
  - `High-risk reports` -> risky action filters.
  - `Employee risk` -> employee profile.
- Добавить "Recent simulation events" или "Generated workload" на cockpit: последние 5 синтетических случаев без ground truth. Это поможет пользователю понять, почему цифры меняются.

### 4.2 Alert queue

Текущее направление ок: URL-driven filters и dense list.

Улучшения:

- Заменить ручной `Reporter ID` на select/search по сотрудникам с именем, ролью/persona и id в мелком тексте.
- Добавить быстрые presets:
  - `Needs triage`: `new + investigating`.
  - `High risk`: high/critical.
  - `Credential risk`: `entered_credentials`.
  - `Eligible for learning`: malicious + high/critical + no assignment.
- В каждой строке/карточке показывать "why this matters": risky actions + reporter risk status + age of alert.
- Явно отделить manual reports от simulation reports. Это может быть маленький текстовый tag: `manual` / `simulated`.

### 4.3 Alert details

Сейчас экран функционален, но действия слишком сырые.

Улучшения:

- Показывать только допустимые next actions:
  - `new`: Start investigation, Resolve as safe, Resolve as malicious.
  - `investigating`: Resolve as safe, Resolve as malicious.
  - `resolved_*`: Close alert, Add note.
  - `closed`: только read-only timeline/details.
- Для недоступного learning показывать reason:
  - `Available after resolving as malicious with high or critical severity`.
  - `Already assigned`.
  - `Not needed for low/medium severity`.
- Добавить reporter context прямо на экран details:
  - employee name;
  - risk status;
  - total reports/high-risk reports;
  - link to profile if enabled.
- Для simulation cases добавить нейтральный tag `Simulated case`, но не показывать hidden ground truth на detail screen.
- Сделать note form частью timeline: поле "Add investigation note" должно быть визуально ближе к событиям, потому что это не отдельная сущность, а audit trail.

## 5. Симуляция: ок/не ок

### Что ок

- Есть понятные controls: start, pause, inject once, reset.
- Есть guardrails: rate `1..20`, malicious ratio `0..1`, severity mix sum `100`.
- Есть seed, значит сценарий можно повторять.
- Ground truth хранится server-side и не попадает в triage UI.
- Метрики качества решений уже выходят за пределы обычного dashboard vanity layer.

### Что не ок для финального showcase

- `tickSimulation` вызывается из `load` на `/admin` и `/admin/simulation`. Это ломает ментальную модель: чтение страницы не должно создавать события.
- В UI не объяснено, что `maliciousRatio` влияет на скрытую истину, а `severityMix` - на распределение создаваемых случаев.
- `severityMix` задает hidden severity, а templates задают risky actions. Если alert severity не объяснить, пользователь может не понять, почему письмо с одними действиями получило другой уровень severity.
- Reset может быть воспринят как destructive action без пояснения, что именно сбрасывается: только generated cases или вся demo state.
- Нет visible "run clock": когда следующий synthetic report ожидается и когда был последний tick.

### Рекомендуемая модель симуляции

Сделать симуляцию явно управляемой системой:

```txt
Simulation session
-> config
-> generated workload
-> admin decisions
-> quality metrics
```

Точки улучшения:

- Вынести генерацию из `load` в явное действие:
  - `POST ?/tick` от небольшого client-side heartbeat;
  - или `POST /api/admin/simulation/tick`;
  - или отдельный demo-only timer на сервере, если showcase будет жить в одном процессе.
- `load` должен только читать summary.
- `onMount` polling должен вызывать targeted refresh, а не `invalidateAll`, чтобы не перезапускать лишние `load`.
- На странице simulation добавить блок "How this simulation works":
  - Generated reports enter the same alert queue as manual reports.
  - Admins never see ground truth while triaging.
  - Quality metrics compare resolved decisions with hidden ground truth.
- Добавить generated cases feed:
  - time;
  - reporter;
  - subject;
  - severity;
  - current status;
  - link to alert.
- Для false positives/false negatives добавить drill-down list после решения: какие алерты попали в ошибку. Ground truth можно показывать только на simulation metrics page, не в triage detail.

## 6. Employee Risk Profiles

Профили - сильное усиление showcase, потому что они объясняют, зачем админке знать не только письмо, но и человека.

Что оставить:

- Сводки по всем сотрудникам.
- Детальный drill-down для employee profiles.
- Risk status: stable / needs attention / high risk context.
- Метрики по risky actions и learning completion.

Что улучшить:

- Переименовать блок в `Employee risk context`, чтобы не звучало как HR-monitoring.
- Объяснить, что profiles используют только demo signals из reports/alerts/learning, без персональных HR-данных.
- Если full profile включен только для Alice/Bob, назвать это явно: `Pilot profiles`, `Summary-only teammates`.
- Лучше для showcase включить profile details для всех сотрудников, если нет продуктовой причины ограничивать.
- Добавить link из alert queue/details в employee profile.
- В profile details добавить timeline-like story:
  - reported email;
  - risky action;
  - alert outcome;
  - learning assigned/completed.

## 7. UX: как донести легенду приложения

Главная UX-задача - не объяснить каждую кнопку, а помочь пользователю понять причинно-следственную цепочку.

### 7.1 Язык интерфейса

Использовать спокойные operational labels:

- `Reported`
- `Investigating`
- `Resolved as malicious`
- `Learning assigned`
- `Completed`
- `Simulated case`
- `Hidden ground truth`
- `Decision quality`
- `Follow-up learning`

Избегать blame-формулировок:

- не `User failed`;
- не `Danger mistake`;
- не `Bad employee`.

### 7.2 Продуктовые подсказки

Нужны короткие inline-пояснения в 4 местах:

- Cockpit: "Simulation creates reports into the same queue as employee submissions."
- Alert details: "Ground truth is hidden during triage."
- Simulation metrics: "Decision quality is calculated after alerts are resolved."
- Learning: "Follow-up learning is assigned when malicious high-risk behavior is confirmed."

Это не должно быть лендинг-копирайтингом. Это компактные operational hints рядом с данными.

### 7.3 State communication

Для каждого важного состояния нужен не только цвет, но и текст:

- severity: `High severity`, `Critical severity`;
- risk status: `Needs attention`, `High risk context`;
- learning state: `Assigned`, `In progress`, `Completed`;
- simulation: `Paused`, `Running`, `Last generated at ...`.

### 7.4 Empty/error states

Пустые состояния должны двигать showcase:

- No alerts: `Start simulation or submit a manual report to create workload.`
- No filtered alerts: `No alerts match these filters. Clear filters or choose another status.`
- No learning: `Learning appears after an admin confirms a high-risk malicious alert.`
- No employee profile history: `This employee has no report activity in the current seed.`

## 8. SvelteKit best practices и формы

Исследованные официальные источники:

- [SvelteKit Form actions](https://svelte.dev/docs/kit/form-actions)
- [SvelteKit State management](https://svelte.dev/docs/kit/state-management)
- [SvelteKit Server-only modules](https://svelte.dev/docs/kit/server-only-modules)
- [SvelteKit Remote functions](https://svelte.dev/docs/kit/remote-functions)

### 8.1 Что уже соответствует практикам

- Core mutations используют SvelteKit form actions, а не ad hoc client fetch.
- Формы остаются работоспособными без client-side JavaScript.
- Серверная Zod-валидация является source of truth.
- Mock state и commands лежат в `$lib/server`, что соответствует server-only boundaries.
- URL filters в alert queue - хорошее решение для состояния, которое должно переживать reload и влиять на SSR.

### 8.2 Главные технические улучшения

1. Использовать `fail(...)` для неуспешных action responses.

Сейчас actions часто возвращают:

```ts
return {
  success: false,
  values: input,
  fieldErrors
};
```

SvelteKit рекомендует для validation errors возвращать `fail(400 или 422, data)`. Это даст корректный `result.type === 'failure'`, `page.status` и нормальную интеграцию с `use:enhance`.

Рекомендуемая мапа:

```txt
400/422 validation
403 permission
404 not found where appropriate
409 lifecycle conflict / duplicate assignment
500 controlled demo failure
```

2. Убрать side effects из `load`.

Официальные docs прямо рекомендуют делать `load` чистым. Поэтому `commands.tickSimulation(locals.user)` в `src/routes/admin/+page.server.ts` и `src/routes/admin/simulation/+page.server.ts` нужно заменить на explicit mutation path.

3. Разделить результаты нескольких форм.

На `/admin` одновременно есть simulation controls и flow settings. ActionData должен содержать хотя бы:

```ts
{
  formId: 'simulation-controls' | 'simulation-settings';
  success: boolean;
  ...
}
```

Иначе ошибка или saved-state одного блока может быть показана в другом.

4. Централизовать парсинг `FormData`.

Сейчас `readConfig` продублирован в двух route files, а в alert actions есть `as never`. Лучше сделать server-side helpers:

```txt
parseSubmitReportForm(formData)
parseAlertCommandForm(formData)
parseSimulationConfigForm(formData)
```

Они должны возвращать plain unknown/object, а Zod schema уже нормализует типы через preprocess.

5. Настроить progressive enhancement на все core mutations.

Минимальный набор:

- report submit: pending button + preserve values on validation/server failure;
- alert command buttons: pending только для нажатой кнопки;
- add note: pending + clear textarea on success;
- assign learning: pending + disabled/reason when unavailable;
- complete learning: pending + success state.

6. Исправить success detection в `OSimulationFlowSettings`.

Сейчас:

```ts
saved = result.type === 'success';
```

Если action вернул `{ success: false }` без `fail`, UI может показать `Settings saved`. После перехода на `fail` станет лучше, но безопаснее проверять и данные:

```ts
saved = result.type === 'success' && result.data?.success === true;
```

7. Сузить invalidation.

`invalidateAll()` прост, но для simulation polling слишком широкий. Лучше:

- добавить `depends('app:simulation')` в соответствующий `load`;
- после tick/update вызывать `invalidate('app:simulation')`;
- для dashboard отдельно `depends('app:dashboard')`, если нужно.

8. Улучшить доступность полей.

`MField` сейчас оборачивает input label-ом, это базово ок, но ошибки не связаны с input через `aria-describedby`, а inputs не получают `aria-invalid`.

Рекомендуется:

- генерировать стабильный `id`;
- передавать его в input;
- error paragraph делать с id;
- input получать `aria-invalid={!!error}` и `aria-describedby={errorId}`.

## 9. Приоритетный план улучшений

### P0 - перед финальным showcase

- Убрать `tickSimulation` из `load`; сделать явный tick/heartbeat action.
- Перевести неуспешные form actions на `fail(...)`.
- Исправить `saved` detection в simulation settings.
- Показывать только допустимые alert actions и reasons для disabled learning.
- Добавить microcopy про hidden ground truth и общую pipeline-легенду.
- Заменить reporterId input на понятный reporter filter.

### P1 - усилить продуктовую историю

- Добавить recent generated workload feed.
- Добавить drill-down для false positives/false negatives на simulation page.
- Связать alert details с employee profile.
- Включить full employee details для всех demo employees или явно назвать pilot/summary-only режим.
- Разделить form state по `formId` на страницах с несколькими формами.

### P2 - полировка инженерной демонстрации

- Добавить targeted invalidation через `depends`.
- Вынести FormData parsers из route files.
- Добавить pending states на все core mutation forms.
- Улучшить aria-связи полей и ошибок.
- Проверить, где Svelte 5 `PageProps` может заменить legacy `export let data/form`, но это не блокер.

## 10. Итоговое решение по текущему варианту

Текущее решение **ок как база**: домен выбран удачно, архитектура читается, simulation/profile enhancements усиливают продукт.

Но для финального showcase нужно сместить акцент:

- не "у нас есть симулятор";
- а "симуляция создает операционную нагрузку, на которой видно качество админских решений";
- не "у нас есть профили";
- а "профили объясняют human risk context и зачем назначается learning";
- не "у нас есть dashboard";
- а "cockpit показывает очередь, качество решений и замыкание learning loop".

Самая важная техническая правка перед этим - убрать мутацию из `load` и привести form actions к SvelteKit failure semantics. После этого UX-легенда будет опираться на предсказуемую механику, а не на случайные обновления страницы.
