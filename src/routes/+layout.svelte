<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="root">
	<div class="bg" aria-hidden="true">
		<div class="bg-base"></div>
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>
		<div class="blob blob-4"></div>
		<div class="glow"></div>
	</div>
	<main class="main">{@render children()}</main>
</div>

<style>
	.root {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
	}

	.bg {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.bg-base {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 100% 60% at 50% -10%, rgba(99, 102, 241, 0.4), transparent 50%),
			radial-gradient(ellipse 70% 50% at 100% 60%, rgba(236, 72, 153, 0.25), transparent 45%),
			radial-gradient(ellipse 70% 50% at 0% 70%, rgba(34, 211, 238, 0.25), transparent 45%),
			#1a1a2e;
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.55;
		animation: blob-float 20s ease-in-out infinite;
	}

	.blob-1 {
		width: min(400px, 50vw);
		height: min(400px, 50vw);
		top: -5%;
		left: -5%;
		background: linear-gradient(135deg, #6366f1, #a855f7);
		animation-duration: 22s;
		animation-delay: 0s;
	}

	.blob-2 {
		width: min(350px, 45vw);
		height: min(350px, 45vw);
		top: 40%;
		right: -10%;
		background: linear-gradient(135deg, #ec4899, #f472b6);
		animation-duration: 18s;
		animation-delay: -5s;
	}

	.blob-3 {
		width: min(380px, 48vw);
		height: min(380px, 48vw);
		bottom: -15%;
		left: 0%;
		background: linear-gradient(135deg, #06b6d4, #22d3ee);
		animation-duration: 25s;
		animation-delay: -10s;
	}

	.blob-4 {
		width: min(280px, 35vw);
		height: min(280px, 35vw);
		top: 60%;
		left: 40%;
		background: linear-gradient(135deg, #8b5cf6, #c084fc);
		animation-duration: 20s;
		animation-delay: -7s;
	}

	@keyframes blob-float {
		0%, 100% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		33% {
			transform: translate(6%, -10%) scale(1.1) rotate(5deg);
		}
		66% {
			transform: translate(-8%, 6%) scale(0.95) rotate(-3deg);
		}
	}

	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 80% 50% at 50% 50%,
			rgba(167, 139, 250, 0.08) 0%,
			transparent 70%
		);
		animation: glow-pulse 6s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%, 100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}

	.main {
		position: relative;
		z-index: 1;
	}
</style>
