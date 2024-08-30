<!-- @format -->

<template>
	<div class="clients">
		<div class="filter">
			<div class="filter_row">
				<Selects
					v-model="selectedCategory"
					:options="clientStore.categories"
					placeholder="Выберите категорию"
					@update:modelValue="clientStore.updateCategory"
				/>
				<Selects
					v-model="selectedStatus"
					:options="clientStore.statuses"
					placeholder="Выберите статус"
					@update:modelValue="clientStore.updateStatus"
				/>
				<Selects
					v-model="selectedCity"
					:options="clientStore.cities"
					placeholder="Выберите город"
					@update:modelValue="clientStore.updateCity"
				/>
				<Selects
					v-model="hasWebsite"
					:options="clientStore.hasWebsiteOptions"
					placeholder="Наличие сайта"
					@update:modelValue="clientStore.updateHasWebsite"
				/>
				<Selects
					v-model="perPage"
					:options="clientStore.perPageOptions"
					placeholder="Элементов на странице"
					@update:modelValue="clientStore.updatePerPage"
				/>
			</div>
			<div class="filter_row">
				<div class="search-filter">
					<input
						type="text"
						v-model="searchQuery"
						placeholder="Введите запрос для поиска"
						@input="filterBySearch"
						class="search-input"
					/>
					<input
						type="text"
						v-model="searchPhone"
						placeholder="Введите номер телефона"
						@input="filterByPhone"
						class="phone-input"
					/>
				</div>
				<div class="change__card">
					<div
						class="row-template"
						@click="changeToRowTemplate"
						:class="{ active: currentView === 'list' }"
					>
						<Icons icon="mingcute:rows-3-fill" size="20" />
					</div>
					<div
						class="card-template"
						@click="changeToCardTemplate"
						:class="{ active: currentView === 'card' }"
					>
						<Icons icon="mingcute:rows-3-fill" size="20" />
					</div>
				</div>
				<div class="clear_filter" @click="clearFilters">
					<Icons icon="healthicons:cleaning-outline" />
				</div>
			</div>
		</div>
		<div class="clients_main">
			<Loader v-if="clientStore.isLoading" style="background-color: transparent" />
			<div v-else>
				<div class="client_list__w" v-if="clientStore.clients.length > 0">
					<div :class="[currentView === 'list' ? 'list' : 'cards', 'clients__list']">
						<component
							v-for="item in clients"
							:key="item.id"
							:is="currentView === 'list' ? ClientCard : ClientCardDefault"
							:card="item"
							:class="clientStore.getStatusClass(item.acf.status)"
						/>
					</div>
					<pagination
						@nextPage="clientStore.updatePage(clientStore.page + 1)"
						@prevPage="clientStore.updatePage(clientStore.page - 1)"
						:totalPages="clientStore.totalPages"
						:currentPage="clientStore.page"
					/>
				</div>
				<div v-else>
					<p>Нет результатов по вашему запросу</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted } from "vue";
	import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
	import ClientCard from "@/components/ui/card/ClientCard.vue";
	import ClientCardDefault from "@/components/ui/card/ClientCardDefault.vue";
	import pagination from "@/components/ui/buttons/pagination.vue";
	import Loader from "@/components/ui/loading/Loader.vue";
	import Selects from "@/components/ui/dropdown/Selects.vue";

	const clientStore = useClientStore();
	const {
		clients,
		selectedCategory,
		selectedStatus,
		selectedCity,
		hasWebsite,
		perPage,
		searchPhone,
		searchQuery,
		currentView,
	} = useClientStoreRefs();

	onMounted(() => {
		clientStore.getClients();
		clientStore.getCategories();
	});

	function filterBySearch() {
		clientStore.updateSearchQuery(clientStore.searchQuery);
	}

	function filterByPhone() {
		clientStore.updateSearchPhone(clientStore.searchPhone);
	}

	function changeToRowTemplate() {
		clientStore.setCurrentView("list");
	}

	function changeToCardTemplate() {
		clientStore.setCurrentView("card");
	}

	function clearFilters() {
		clientStore.clearFilters();
	}
</script>

<style scoped lang="scss">
	.clients {
		min-height: 100vh;
		position: relative;
		width: 100%;
	}

	.filter {
		margin-bottom: 20px;
		@include flex-start;
		flex-wrap: wrap;
		gap: 20px;
	}

	.filter_row {
		width: 100%;
		@include flex-start;
		gap: 10px;

		@include bp($point_4) {
			flex-direction: column;
			width: 100%;
		}
	}

	.change__card {
		@include flex-start;
		gap: 5px;

		@include bp($point_4) {
			display: none;
		}

		div {
			@include flex-center;
			background-color: $bg-color-secondary;
			width: 42px;
			height: 42px;
			border-radius: 5px;
			color: $secondary-blue-active;
			cursor: pointer;
			svg {
				color: $secondary-blue-active !important;
			}

			&.active {
				background-color: $secondary-blue;
				svg {
					color: $primary-blue-active !important;
				}
			}

			&:nth-child(2) {
				transform: rotate(90deg);
			}
		}
	}

	.center_pag {
		min-width: 200px;
		@include flex-center;
		font-size: 18px;
	}

	.clients__list {
		overflow-x: auto;
		max-width: 100%;
		margin-bottom: 30px;

		&.cards {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
			grid-gap: 20px;

			@include bp($point_4) {
				grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
			}
		}
	}

	.clients_main {
		width: 100%;
	}

	.filter {
		@include bp($point_4) {
			flex-direction: column;
		}
	}

	.clear_filter {
		justify-content: center;
		display: flex;
		align-items: center;
		background-color: #ebecf0;
		width: 42px;
		height: 42px;
		border-radius: 5px;
		color: #aeccff;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		&:hover {
			background-color: #cdd3eb;
		}
	}

	.filter_row {
		input {
			background-color: #ebecf0;
			border: 1px solid #ccc;
			border-radius: 5px;
			width: 100%;
			max-width: 300px;
			height: 42px;
			padding: 10px;
			&:focus {
				outline: none;
			}
		}
	}

	.search-filter {
		display: flex;
		gap: 20px;
		flex-grow: 1;
	}
</style>
