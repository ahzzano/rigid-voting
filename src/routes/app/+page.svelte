<script lang="ts">
    import type { PageProps } from "../$types";

    let { data }: PageProps = $props();

    let polls = data.polls;
    console.log(polls);
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

<div>
    {#each polls as poll}
        <div>
            {poll.pollname}
        </div>
    {/each}
</div>
