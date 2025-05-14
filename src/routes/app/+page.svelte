<script lang="ts">
    import type { Poll } from "$lib/db/schema";
    import type { PageProps } from "../$types";

    let { data }: PageProps = $props();

    let { polls } = data;
</script>

<a href="/app/user">User Settings</a>
<a href="/logout"> Logout </a>

<div>
    <span>Create Poll</span>

    <form method="POST" action="?/add_poll">
        <input name="pollName" class="input" />
        <button class="btn">Add</button>
    </form>
</div>

<div class="flex flex-col">
    {#each polls as poll}
        <a href="/app/{poll.id}">
            {poll.pollname}
        </a>
    {/each}
</div>
