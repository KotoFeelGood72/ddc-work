<!-- @format -->

<template>
	<div class="admin-header">
		<div class="admin__main">
			<div class="row-start">
				<div class="main-link">
					<RouterLink to="/clients?page=1&view=list&count=10">Клиенты</RouterLink>
				</div>
			</div>
			<div class="row-end">
				<notificationBtn />
				<div class="user">
					<avatar @click="toggleUserModal" />
					<UserModal v-if="userModal" ref="userModalRef" class="user-dropdown" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onBeforeUnmount, ref } from "vue";
	import avatar from "../ui/people/avatar.vue";
	import notificationBtn from "../ui/buttons/notification-btn.vue";
	import UserModal from "../modal/view/UserModal.vue";
	import { useUsersStore } from "@/store/useUserStore";
	import { useRouter } from "vue-router";

	const { clearUser } = useUsersStore();
	const router = useRouter();
	const userModal = ref<boolean>(false);
	const userModalRef = ref<HTMLElement | null>(null);

	const toggleUserModal = () => {
		userModal.value = !userModal.value;
	};

	onMounted(() => {
		// document.addEventListener("click", handleClickOutside);
	});

	onBeforeUnmount(() => {
		// document.removeEventListener("click", handleClickOutside);
	});

	function logout() {
		clearUser();
		router.push("/");
	}
</script>

<style scoped lang="scss">
	.admin-header {
		padding: 10px 20px;
		height: 70px;
		border-bottom: 1px solid #ebecf0;
		@include bp($point_4) {
			@include flex-space;
		}
		.admin__main {
			@include flex-space;
			// background-color: $bg-color-tertiary;
			// border-radius: 15px;
			width: 100%;
			gap: 20px;
			padding: 10px 20px;
			@include bp($point_4) {
				padding: 0;
			}
		}
	}

	.row-end {
		@include flex-end;
		gap: 20px;
	}
	.row-start {
		flex-grow: 1;
	}
	.main-link {
		@include flex-center;
		background-color: $bg-color-secondary;
		flex-grow: 1;
		width: 100%;
		border-radius: 10px;
		a {
			color: $text-color-secondary;
			text-decoration: none;
			@include flex-center;
			padding: 7px 25px;
			width: 100%;
		}
	}

	.user-dropdown {
		position: absolute;
		top: calc(100% + 13px);
		right: 0;
	}

	.user {
		position: relative;
		z-index: 999;
	}
</style>
