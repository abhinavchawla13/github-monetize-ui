<template>
  <div class="flex flex-col">
    <div
      class="mx-auto w-11/12 mx-4 py-8 px-4 overflow-x-auto md:w-5/6 lg:w-5/6 sm:px-6 lg:py-8 lg:px-8 lg:flex lg:items-center lg:justify-between lg:max-w-screen-xl"
    >
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider pl-10"
              >Repository</th>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >Last Updated</th>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >Status</th>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >Link</th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
            </tr>
          </thead>

          <tbody class="bg-white" v-for="repo in repos" :key="repo.name">
            <tr>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm leading-5 font-medium text-gray-900">{{ repo.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div class="text-sm leading-5 text-gray-500">{{ repo.lastUpdated }}</div>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <span
                  v-if="repo.status == 'published'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >Published</span>
                <span
                  v-if="repo.status == 'unpublished'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                >Unpublished</span>
              </td>
              <td
                class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500"
              >{{ repo.link }}</td>
              <td
                class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium"
              >
                <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
              </td>
            </tr>
          </tbody>

          <tbody v-if="!repos.length">
            <tr>
              <td class="text-center py-5" colspan="4">No repositories added yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      repos: [
        {
          name: "bethehope-api",
          status: "published",
          lastUpdated: "2020-02-12 1:32pm",
          link: "https://document.com/12jh49k"
        },
        {
          name: "bethehope-client-ui",
          status: "unpublished",
          lastUpdated: "2020-01-19 2:52pm",
          link: "https://document.com/13jaq9k"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>