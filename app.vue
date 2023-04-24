<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import 'fork-corner/dist/fork-corner.css';
import { storeToRefs } from 'pinia';
import initForkCorner from '~/fork-corner';
import AppSidebar from '~/components/AppSidebar.vue';
import { useAppStore } from '~/stores/app';
import { useConversationsStore } from '~/stores/conversations';
// import { sign } from 'crypto';

// import { createAuth0 } from '@auth0/auth0-vue';

// import auth from "@/authfile";

const { status, data, signOut, signIn } = useAuth()

console.log(status.value)
console.log(data.value)

if (status.value == "unauthenticated") {
    // 自动跳转到登录界面
    await signIn()
}


// await signIn()
// await signOut()

const appStore = useAppStore();
const conversationsStore = useConversationsStore();

const {
    isMenuOpen,
    isMenuOpening,
} = storeToRefs(appStore);

const {
    conversationTitle,
} = storeToRefs(conversationsStore);

useHead({
    // title: `${conversationTitle.value} - PandoraAI`,
    title: `AstChat: 划时代智能聊天助手`,
    meta: [
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      
          },
    ],
});

onMounted(() => {
    initForkCorner();
});




</script>

<template>


    <a
        target="_blank"
        id="fork-corner"
        class="fork-corner fc-size-small fc-pos-tr fc-animate"
    ></a>
    <div class="flex flex-row min-h-screen text-slate-300  overflow-hidden backdrop-blur">
        <AppSidebar/>
        <Transition name="fade">
            <div
                v-if="isMenuOpen"
                @click="isMenuOpen = false"
                class="fixed inset-0 bg-black/30 z-10 lg:hidden" aria-hidden="true"
            />
        </Transition>
        <div
            class="flex flex-col flex-1 w-full"
            :class="{
                'lg:ml-[20rem] transition-all ease-in-out': isMenuOpening,
                'lg:ml-0': !isMenuOpening,
            }"
        >
            <header class="px-3 py-3 text-center bg-[#87CEEB]/40 shadow relative transition">
                <!-- Menu icon -->
                <button
                    @click="isMenuOpen = true"
                    class="
                        absolute top-0 left-0 p-3  text-black/70 hover:text-white/90 z-10 mb-22
                        focus:outline-none
                        transition duration-300 ease-in-out
                        lg:hidden
                    "
                >
                    <Icon name="bx:bx-menu" class="w-8 h-8" />
                </button>
                <!-- Show/Hide sidebar button (lg) -->
                <button
                    @click="isMenuOpen = !isMenuOpen"
                    class="
                        absolute top-0 left-0 p-3  text-black/70 hover:text-white/90 z-10
                        focus:outline-none
                        transition duration-300 ease-in-out
                        hidden lg:block
                    "
                >
                    <Icon
                        :name="isMenuOpen ? 'bx:bx-chevron-left' : 'bx:bx-chevron-right'"
                        class="w-8 h-8"
                    />
                </button>
                <!-- Title -->
                <h1 class="text-xl font-bold text-black/60 drop-shadow-md">AstChat</h1>
            </header>
            <main class="flex flex-grow py-2">
                <Chat 
                @click="isMenuOpen = false"
                />
            </main>
            <footer class="px-3 pb-6 text-center">
                <span class="text-xs font-light text-slate-400">
                    
                    <!-- <a href="https://github.com/waylaidwanderer/node-chatgpt-api" target="_blank">
                        https://github.com/waylaidwanderer/node-chatgpt-api
                    </a> -->
                </span>
            </footer>
        </div>
    </div>


    <div class="w-full max-w-5xl mx-auto bg-white px-5 py-4 rounded-t shadow-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img
              v-if="status === 'authenticated' && data?.user?.image"
              class="w-12 h-12 rounded-full"
              :src="data.user.image"
              alt="User Avatar"
          />
          <h1 v-if="status === 'authenticated'" class="text-lg">
            Authenticated as {{ data?.user?.name }}!
          </h1>
          <h1 v-else>
            Not logged in
          </h1>
        </div>
        <button v-if="status === 'authenticated'" class="flex items-center justify-center space-x-2 bg-red-500 text-white rounded-lg py-2 px-3 text-lg" @click="signOut({ callbackUrl: '/' })">
          <span>Logout</span>
        </button>
        <button v-else class="flex items-center justify-center space-x-2 bg-green-500 text-white rounded-lg py-2 px-3 text-lg" @click="signIn()">
          <i class="fa fa-right-to-bracket pt-0.5" />
          <span>Login</span>
      </button>
      </div>
    </div>

</template>

<style>
:root {
    --background: hsl(240, 80%, 10%);
}

body {
    background:
        radial-gradient(
            60vmax 60vmax at 50% 50%,
            hsla(0, 0%, 100%, 0.88) 0%,
            hsla(0, 0%, 96%, 0.88) 95%),
        radial-gradient(
            80vmax 50vmax at 60% 0%,
            hsla(153, 88%, 43%, 0.9) 0%,
            hsla(240, 14%, 67%, 0.5) 50%,
            hsla(43, 91%, 49%, 0.534) 95%),

        radial-gradient(
            90vmax 50vmax at 50vmax 50vmax,
            hsla(0, 0%, 100%, 0.9) 0%,
            hsla(0, 0%, 2%, 0.9) 95%)
        var(--background);
}

footer a {
    @apply opacity-75 hover:opacity-100 transition duration-300 ease-in-out;
    background: linear-gradient(to right, #37feff 0%, #0aff2b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

#fork-corner {
    z-index: 41;
    top: 5px !important;
    right: 5px !important;
}

.fork-corner.fc-theme-github + div {
    top: -88px !important;
    right: -88px !important;
    @apply shadow bg-black/50 z-40;
}

.fork-corner.fc-theme-github > i {
    @apply text-white/0;
    font-size: 35px !important;
}

::-webkit-scrollbar {
    width: 9px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
}
</style>
