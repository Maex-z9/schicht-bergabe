<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";

  // Public routes don't get the app shell (sidebar) — login screens etc.
  const publicPaths = ["/login", "/signup"];
  $: isPublic = publicPaths.some((p) => $page.url.pathname.startsWith(p));

  const nav = [
    { href: "/", label: "Dashboard" },
    { href: "/employees", label: "Employees" },
    { href: "/certificates", label: "Certificates" },
    { href: "/settings", label: "Settings" },
  ];
</script>

<svelte:head>
  <title>Certificate Tracker</title>
</svelte:head>

{#if isPublic}
  <slot />
{:else}
  <div class="app-shell">
    <aside class="app-sidebar">
      <a class="app-brand" href="/">
        <span class="mark" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 32 32">
            <path
              d="M9 16l5 5 9-11"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </span>
        <span>Certificate Tracker</span>
      </a>

      <nav aria-label="Main">
        <ul class="app-nav">
          {#each nav as item}
            <li>
              <a
                href={item.href}
                aria-current={$page.url.pathname === item.href ||
                ($page.url.pathname.startsWith(item.href) && item.href !== "/")
                  ? "page"
                  : null}>{item.label}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
    </aside>

    <main class="app-content">
      <slot />
    </main>
  </div>
{/if}
