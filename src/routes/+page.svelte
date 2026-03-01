<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { animate } from 'animejs';
	import { parseColorInput, formatColor, OUTPUT_FORMAT_LABELS, type OutputFormat } from '$lib/color';

	let input = $state('');
	let selectedFormats = $state<OutputFormat[]>(['0xARGB', '0xRGB', 'hex6', 'hex8']);
	let copiedId = $state<string | null>(null);
	let panelEl: HTMLDivElement;

	const COMMON_COLORS = [
		{ name: 'แดง', value: '#ef4444' },
		{ name: 'ส้ม', value: '#f97316' },
		{ name: 'เหลือง', value: '#eab308' },
		{ name: 'เขียว', value: '#22c55e' },
		{ name: 'ฟ้า', value: '#06b6d4' },
		{ name: 'น้ำเงิน', value: '#3b82f6' },
		{ name: 'ม่วง', value: '#8b5cf6' },
		{ name: 'ชมพู', value: '#ec4899' },
		{ name: 'ขาว', value: '#ffffff' },
		{ name: 'ดำ', value: '#000000' },
		{ name: 'เทา', value: '#6b7280' }
	] as const;

	const color = $derived(parseColorInput(input));

	const results = $derived.by(() => {
		if (!color) return [];
		return selectedFormats.map((f) => ({ format: f, value: formatColor(color, f) }));
	});

	const previewStyle = $derived(
		color
			? `background: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
			: 'background: rgba(255,255,255,0.06);'
	);

	function toggleFormat(f: OutputFormat) {
		if (selectedFormats.includes(f)) {
			selectedFormats = selectedFormats.filter((x) => x !== f);
		} else {
			selectedFormats = [...selectedFormats, f];
		}
	}

	function copyValue(value: string, id: string) {
		navigator.clipboard.writeText(value);
		copiedId = id;
		setTimeout(() => (copiedId = null), 1200);
	}

	function setExampleColor(hex: string) {
		input = hex;
	}

	onMount(() => {
		if (!panelEl) return;
		animate(panelEl, {
			opacity: [0, 1],
			translateY: [24, 0],
			duration: 700,
			ease: 'outExpo'
		});
	});
</script>

<div class="page">
	<div class="panel" bind:this={panelEl}>
		<header class="header">
			<h1 class="title">Color Converter</h1>
			<p class="sub">ใส่สีแบบ #hex หรือ ARGB แล้วเลือกรูปแบบที่ต้องการแปลง</p>
		</header>

		<div class="card input-card">
		<label for="color-input">ค่าสี (รองรับ #RGB, #RRGGBB, #AARRGGBB, 0x..., ARGB ตัวเลข, A,R,G,B)</label>
		<input
			id="color-input"
			type="text"
			class="color-input"
			placeholder="เช่น #ff5500 หรือ 0xFF5500 หรือ 255,85,0"
			bind:value={input}
		/>
		{#if color}
			<div class="preview preview-visible" style={previewStyle} title="ตัวอย่างสี"></div>
		{:else if input.trim()}
			<p class="hint error">รูปแบบไม่รู้จัก ลอง #hex หรือ ARGB</p>
		{/if}

		<div class="examples">
			<span class="examples-label">สีที่ใช้บ่อย:</span>
			<div class="examples-list">
				{#each COMMON_COLORS as { name, value }}
					<button
						type="button"
						class="example-chip"
						style="--chip-color: {value}"
						title="{name} ({value})"
						onclick={() => setExampleColor(value)}
					>
						<span class="example-chip-swatch"></span>
						<span class="example-chip-name">{name}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="card formats-card">
		<h2>เลือกรูปแบบที่ต้องการแปลง</h2>
		<div class="format-toggles">
			{#each Object.entries(OUTPUT_FORMAT_LABELS) as [key, label]}
				<label class="toggle">
					<input
						type="checkbox"
						checked={selectedFormats.includes(key as OutputFormat)}
						onchange={() => toggleFormat(key as OutputFormat)}
					/>
					<span>{label}</span>
				</label>
			{/each}
		</div>
	</div>

	{#if color && results.length > 0}
		<div class="card results-card">
			<h2>ผลลัพธ์</h2>
			<ul class="results">
				{#each results as { format, value }, i (format)}
					{@const id = `${format}-${value}`}
					<li
						class="result-row"
						in:fly={{ x: 20, duration: 400, delay: i * 50, easing: cubicOut }}
						out:fly={{ x: -10, duration: 200 }}
					>
						<span class="format-name">{OUTPUT_FORMAT_LABELS[format]}</span>
						<code class="value">{value}</code>
						<button
							type="button"
							class="copy-btn"
							class:copied={copiedId === id}
							title="คัดลอก"
							onclick={() => copyValue(value, id)}
						>
							{#if copiedId === id}
								<span class="copy-btn-icon" aria-hidden="true">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								</span>
							{:else}
								Copy
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	</div>
</div>

<style>
	.page {
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
		font-family: 'Segoe UI', system-ui, sans-serif;
		color: #e8e8e8;
		min-height: 100vh;
	}

	.panel {
		opacity: 0;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.title {
		font-size: 1.85rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 0.5rem 0;
		background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: title-shine 4s ease-in-out infinite;
	}

	@keyframes title-shine {
		0%, 100% {
			background-position: 0% center;
		}
		50% {
			background-position: 100% center;
		}
	}

	.sub {
		color: #888;
		font-size: 0.9rem;
		margin: 0;
	}

	.card {
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 1.25rem 1.5rem;
		margin-bottom: 1.25rem;
		transition: transform 0.25s ease, box-shadow 0.25s ease;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.4);
	}

	.input-card label {
		display: block;
		font-size: 0.85rem;
		color: #aaa;
		margin-bottom: 0.5rem;
	}

	.color-input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-family: ui-monospace, monospace;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 8px;
		color: #fff;
		outline: none;
	}

	.color-input:focus {
		border-color: #a78bfa;
		box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.2);
	}

	.color-input::placeholder {
		color: #555;
	}

	.preview {
		margin-top: 1rem;
		height: 48px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
		transform: scale(0.98);
		opacity: 0;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease, box-shadow 0.3s ease;
	}

	.preview-visible {
		transform: scale(1);
		opacity: 1;
		box-shadow:
			inset 0 0 0 1px rgba(0, 0, 0, 0.2),
			0 0 24px -4px rgba(167, 139, 250, 0.3);
	}

	.hint {
		margin-top: 0.75rem;
		font-size: 0.85rem;
	}

	.hint.error {
		color: #f87171;
	}

	.examples {
		margin-top: 1.25rem;
	}

	.examples-label {
		display: block;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.5rem;
	}

	.examples-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.example-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.6rem;
		font-size: 0.8rem;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		color: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
	}

	.example-chip:hover {
		transform: scale(1.04);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.example-chip-swatch {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		background: var(--chip-color);
		border: 1px solid rgba(255, 255, 255, 0.2);
		flex-shrink: 0;
	}

	.example-chip-name {
		font-weight: 500;
	}

	.formats-card h2,
	.results-card h2 {
		font-size: 0.95rem;
		font-weight: 600;
		color: #ccc;
		margin: 0 0 1rem 0;
	}

	.format-toggles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
	}

	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
		font-size: 0.9rem;
		color: #b0b0b0;
		user-select: none;
	}

	.toggle input {
		accent-color: #a78bfa;
		cursor: pointer;
	}

	.results {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.result-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		flex-wrap: wrap;
	}

	.result-row:last-child {
		border-bottom: none;
	}

	.format-name {
		flex: 0 0 180px;
		font-size: 0.85rem;
		color: #888;
	}

	.value {
		flex: 1;
		min-width: 0;
		font-size: 0.9rem;
		background: rgba(0, 0, 0, 0.25);
		padding: 0.35rem 0.6rem;
		border-radius: 6px;
		color: #c4b5fd;
		word-break: break-all;
	}

	.copy-btn {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.35rem 0.65rem;
		font-size: 0.8rem;
		min-width: 4rem;
		background: rgba(167, 139, 250, 0.2);
		border: 1px solid rgba(167, 139, 250, 0.4);
		border-radius: 8px;
		color: #a78bfa;
		cursor: pointer;
		transition: background 0.2s, border-color 0.2s, transform 0.2s ease;
	}

	.copy-btn-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.copy-btn-icon svg {
		display: block;
	}

	.copy-btn:hover {
		background: rgba(167, 139, 250, 0.3);
		border-color: #a78bfa;
		transform: scale(1.05);
	}

	.copy-btn:active {
		transform: scale(0.96);
	}

	.copy-btn.copied {
		background: rgba(34, 197, 94, 0.25);
		border-color: rgba(34, 197, 94, 0.5);
		color: #4ade80;
		animation: copy-pop 0.4s ease;
	}

	@keyframes copy-pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.12);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
