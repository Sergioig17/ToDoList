<script setup>
import { ref } from 'vue';


</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>To-doList</h1>
      <nav class="app-nav">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/recordatorios" class="nav-link">Recordatorios</RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:global(html, body, #app) {
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  margin: 0;
  padding: 0;
}



.app-container {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

h1 {
  color: var(--color-text-title);
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
}

nav {
  display: flex;
  gap: 16px;
}

a {
  text-decoration: none;
  color: var(--color-text-secondary);
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
  background: rgba(255, 255, 255, 0.55);
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
}

a:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-soft) 100%);
  color: var(--color-on-primary);
  border-color: var(--color-primary);
  box-shadow: 0 8px 18px rgba(39, 67, 97, 0.25);
}

a:active {
  background: var(--color-primary-strong);
}

a.router-link-active {
  background: linear-gradient(135deg, var(--color-primary-strong) 0%, var(--color-primary-soft) 100%);
  color: var(--color-on-primary);
  border-color: var(--color-primary-strong);
}

header {
  background-color: color-mix(in srgb, var(--color-surface) 85%, #ffffff);
  padding: 18px 28px;
  border-bottom: 3px solid var(--color-accent-strong);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
}



@media (max-width: 768px) {
  h1 {
    font-size: 1.8rem;
  }

  header {
    flex-direction: column;
    gap: 16px;
    padding: 16px 20px;
  }

  nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  a {
    padding: 8px 14px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }

  header {
    padding: 12px 16px;
  }

  nav {
    gap: 8px;
  }

  a {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}
</style>
