<!-- @format -->

<template>
	<div class="user-drop">
		<ul class="info-list">
			<li>
				Имя: <span>{{ user.user_display_name }}</span>
			</li>
			<li>
				E-Mail: <span>{{ user.user_email }}</span>
			</li>
		</ul>
		<ul class="settings-list">
			<li>Клиенты</li>
			<li>Избранное</li>
			<li>Настройки</li>
			<li @click="logout()">Выйти</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { useUsersStore, useUsersStoreRefs } from "@/store/useUserStore";
	import { useRouter } from "vue-router";
	const { user } = useUsersStoreRefs();
	const { clearUser } = useUsersStore();

	const router = useRouter();

	async function logout() {
		await clearUser();
		await router.push("/login");
	}
</script>

<style scoped lang="scss">
	.user-drop {
		background-color: #ffffff;
		right: 100%;
		width: 300px;
		box-shadow: 0px 0px 20px 0px #00000011;
		border-radius: 5px;
		padding: 20px;
		.info-list {
			list-style: none;
			margin-bottom: 30px;
			li {
				font-weight: 500;
				span {
					font-weight: 700;
				}
				&:not(:last-child) {
					padding-bottom: 10px;
					margin-bottom: 10px;
					border-bottom: 1px solid #0000001c;
				}
			}
		}
	}

	.settings-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 10px;

		li {
			padding: 5px 20px;
			cursor: pointer;
			background-color: #cacaca33;
			transition: all 0.3s ease-in-out;
			border-radius: 5px;
			&:hover {
				background-color: #8d8a8a33;
			}
		}
	}
</style>
