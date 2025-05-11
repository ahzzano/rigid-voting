<script lang="ts">
    import { enhance } from "$app/forms"; // Import the enhance action

    let { form } = $props();
</script>

Register
<form method="POST" use:enhance>
    {#if form?.issues}
        {#each form.issues as issue}
            {issue.message}
        {/each}
    {/if}
    <label>
        Email
        <input class="input" name="email" required />
    </label>
    <label>
        Password
        <input class="input" name="password" type="password" required />
    </label>
    <button class="btn">signup</button>
</form>
