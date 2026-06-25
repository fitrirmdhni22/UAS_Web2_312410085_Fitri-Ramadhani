/**
 * app.js
 * ------
 * Root komponen aplikasi. Merakit Navbar + RouterView, lalu
 * mount aplikasi Vue ke #app dengan Vue Router terpasang.
 */

const App = {
  components: { Navbar },
  template: `
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <main class="flex-1">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <footer class="bg-base border-t-[3px] border-ink py-6 text-center text-sm font-bold text-ink/70">
        &copy; 2026 E-Library &mdash; UAS Pemrograman Web 2
      </footer>
    </div>
  `,
};

const app = Vue.createApp(App);
app.use(router);
app.mount('#app');
