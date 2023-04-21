<script setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '~/stores/app';
import BingIcon from '~/components/Icons/BingIcon.vue';
import GPTIcon from '~/components/Icons/GPTIcon.vue';

const appStore = useAppStore();
const {
    isMobileMenu,
    isMenuOpen,
    isMenuOpening,
    isMenuClosing,
} = storeToRefs(appStore);

const conversationsStore = useConversationsStore();
const {
    currentConversationId,
    conversations,
    processingController,
} = storeToRefs(conversationsStore);
const {
    startNewConversation,
    setCurrentConversationId,
    deleteConversation,
    clearConversations,
    updateConversationTitle,
} = conversationsStore;

// sort conversations by updatedAt timestamp
const sortedConversations = computed(() => Object.values(conversations.value).sort((a, b) => b.updatedAt - a.updatedAt));

const isConfirmingClear = ref(false);
const conversationTitleToEditId = ref(null);
const conversationTitleToEditInput = ref(null);
const conversationTitleToEditValue = ref('');

const startNewConversationHandler = () => {
    startNewConversation();
    if (isMobileMenu.value) {
        isMenuOpen.value = false;
    }
};

const setCurrentConversationIdHandler = (conversationId) => {
    if (processingController.value) {
        return;
    }
    setCurrentConversationId(conversationId);
    if (isMobileMenu.value) {
        isMenuOpen.value = false;
    }
};

const deleteConversationHandler = (conversationId) => {
    deleteConversation(conversationId);
};

const clearConversationsHandler = () => {
    if (!isConfirmingClear.value) {
        isConfirmingClear.value = setTimeout(() => {
            isConfirmingClear.value = false;
        }, 2000);
        return;
    }
    clearConversations();
    clearTimeout(isConfirmingClear.value);
    isConfirmingClear.value = false;
};

const startEditConversationTitle = (id, event) => {
    event.stopPropagation();
    conversationTitleToEditId.value = id;
    nextTick(() => {
        conversationTitleToEditInput.value[0].focus();
    });
};

const cancelEditConversationTitle = (event) => {
    event.stopPropagation();
    conversationTitleToEditId.value = null;
    conversationTitleToEditValue.value = '';
};

const updateConversationTitleHandler = (event) => {
    event.stopPropagation();
    updateConversationTitle(conversationTitleToEditId.value, conversationTitleToEditValue.value);
    cancelEditConversationTitle(event);
};
</script>

<template>
    <div

        class="
            flex flex-col flex-1 max-w-xs shadow-lg
            absolute top-0 left-0 h-screen z-50 w-full backdrop-blur-lg
            transition-all duration-300 ease-in-out bg-[#EDDCC8]/80
        "
        :class="{
            'translate-x-0 absolute lg:static': isMenuOpen,
            '!absolute': isMenuOpening,
            '-translate-x-full': !isMenuOpen,
        }"
    >
        <!-- close button -->
        <Transition name="fade">
            <div
                v-if="isMenuOpen || isMenuClosing"
                
                class="absolute top-0 -right-8 bottom-0 flex items-center lg:hidden"
            >
                <button
                    @click="isMenuOpen = false"
                    class="
                    bg-purple-100/140 rounded-r
                    text-black/50 hover:text-black/80
                    focus:outline-none z-10
                    transition duration-300 ease-in-out
                "
                >
                    <Icon name="bx:bx-chevron-left" class="w-8 h-8"/>
                </button>
            </div>
        </Transition>
        <!-- Chat threads -->
        <div class="p-3 pb-0">
            <!-- New Chat -->
            <button
                @click="startNewConversationHandler"
                class="
                    flex flex-row items-center w-full bg-white/5 rounded shadow p-3 mb-3
                    transition duration-300 ease-in-out
                    hover:bg-[#66B2FF]/30
                "
                :disabled="!!processingController"
                :class="{ 'cursor-not-allowed': !!processingController }"
            >
                    <span class="flex flex-col flex-1 text-left">
                        <span class="text-sm font-bold text-black/90">新的对话</span>
                        <span class="text-xs text-black/60">点击此处创建新的对话</span>
                    </span>
                <Icon name="bx:bx-plus" class="w-8 h-8 text-black/50"/>
            </button>
        </div>
        <!-- Conversations -->
        <div
            class="flex-1 flex flex-col gap-1 p-3 overflow-y-auto"
        >
            <TransitionGroup name="slide-from-left">
                <div
                    v-for="conversation in sortedConversations"
                    :key="conversation.id"
                    class="flex flex-row items-stretch rounded p-3 pr-0 border-2 border-black/5 hover:bg-[#66B2FF]/30 bg-white/20 text-black/80"
                    :class="{ '!bg-[#66B2FF]/30': conversation.id === currentConversationId }"
                >
                    <div
                        class="flex flex-col flex-1 text-left overflow-hidden "
                        @click="setCurrentConversationIdHandler(conversation.id)"
                        :class="{
                            'cursor-not-allowed': !!processingController,
                            'cursor-pointer': !processingController,
                        }"
                    >
                        <span
                            class="text-sm mb-1 flex flex-row items-center gap-2 w-full"
                            :title="conversation.title"
                        >
                            <span>
                                <GPTIcon
                                    v-if="(conversation.activePreset?.client || conversation.activePresetName) === 'chatgpt'"
                                    class="h-3 rounded-lg opacity-80"
                                />
                                <GPTIcon
                                    v-else-if="(conversation.activePreset?.client || conversation.activePresetName) === 'chatgpt-browser'"
                                    class="h-3 text-[#6ea194] rounded-lg opacity-80"
                                />
                                <BingIcon
                                    v-else-if="(conversation.activePreset?.client || conversation.activePresetName) === 'bing'"
                                    class="h-4 rounded-lg opacity-80"
                                />
                            </span>
                            <span
                                v-if="conversationTitleToEditId === conversation.id"
                                class="flex flex-1 items-center gap-1 "
                            >
                                <input
                                    :placeholder="conversation.title || '未命名对话'"
                                    @click="e => e.stopPropagation()"
                                    ref="conversationTitleToEditInput"
                                    v-model="conversationTitleToEditValue"
                                    class="flex-1 -ml-1 px-1 bg-white/5 rounded-sm text-black/80 text-sm truncate focus:outline-none w-full border border-black/60"
                                />
                                <span class="flex items-center">
                                    <button
                                        @click="updateConversationTitleHandler"
                                        class="flex items-center justify-center text-white/30 hover:text-white/60 transition duration-300 ease-in-out"
                                        :disabled="!!processingController"
                                        :class="{ 'cursor-not-allowed': !!processingController }"
                                    >
                                        <Icon name="bx:bx-check" class="text-lg relative -top-px text-black/80 h-4"/>
                                    </button>
                                    <button
                                        @click="cancelEditConversationTitle"
                                        class="flex items-center justify-center text-black/30 hover:text-black/60 transition duration-300 ease-in-out"
                                        :disabled="!!processingController"
                                        :class="{ 'cursor-not-allowed': !!processingController }"
                                    >
                                        <Icon name="bx:bx-x" class="text-lg h-4 text-black/80 hover:text-[#CC0000]/90"/>
                                    </button>
                                </span>
                            </span>
                            <span
                                v-else
                                class="flex-1 truncate flex items-center gap-1 text-bold"
                            >
                                {{ conversation.title || '未命名对话记录' }}
                                <button
                                    @click="e => startEditConversationTitle(conversation.id, e)"
                                    class="flex items-center justify-center text-black/70 hover:text-white/100 transition duration-300 ease-in-out"
                                    :disabled="!!processingController"
                                    :class="{ 'cursor-not-allowed': !!processingController }"
                                >
                                    <Icon name="bx:bx-edit" class="relative top-px w-5 h-5 flex"/>
                                </button>
                            </span>
                        </span>
                        <!-- <span class="text-xs text-white/30 truncate">
                            {{ conversation.id }}
                        </span> -->
                        <span class="text-sm text-black/80 text-b">
                            创建日期：{{ (new Date(conversation.updatedAt)).toLocaleString() }}
                        </span>
                    </div>
                    <button
                        @click="deleteConversationHandler(conversation.id)"
                        class="flex items-center justify-center px-3 text-black/60 hover:text-[#CC0000]/90 transition duration-300 ease-in-out"
                        :disabled="!!processingController"
                        :class="{ 'cursor-not-allowed': !!processingController }"
                    >
                        <Icon name="bx:bx-trash" class="w-5 h-5"/>
                    </button>
                </div>
            </TransitionGroup>
        </div>
        <!-- Sidebar footer -->
        <div class="flex flex-col items-start gap-2 bg-black/10 p-6 min-h-[20px] text-xxl  items-center justify-center">
            <button
                @click="clearConversationsHandler"
                class="flex gap-2 items-center justify-center text-black/90 transition duration-300 hover:text-[#FF0000]/80"
                :disabled="!!processingController"
                :class="{ 'cursor-not-allowed': !!processingController }"
            >
                <Icon :name="isConfirmingClear ? 'bx:bx-check' : 'bx:bx-trash'" class="w-5 h-5 relative top-px"/>
                清除所有对话{{ isConfirmingClear ? '?' : '' }}
            </button>
            <!-- <div class="flex gap-3 items-center w-full">
                <AppData/>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
.slide-from-left-move,
.slide-from-left-enter-active,
.slide-from-left-leave-active {
    transition: all 0.3s ease;
}
.slide-from-left-enter-from,
.slide-from-left-leave-to {
    transform: translateX(-320px);
    opacity: 0;
}

.slide-from-left-leave-active {
    opacity: 0;
}
</style>
