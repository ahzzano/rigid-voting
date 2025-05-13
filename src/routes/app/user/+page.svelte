<script lang="ts">
    // const userData = $
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";
    let { data }: { data: PageData } = $props();
    console.log(data);
</script>

User Settings
<div></div>

{#if data.userInfo != null}
    <div>Hello {data.userInfo.firstName}</div>
{:else}
    <div>Please setup your user</div>
{/if}

Edit Info
<form
    method="POST"
    use:enhance
    action={data.userInfo == null ? "?/insert" : "?/update"}
>
    <input name="firstName" class="input" />
    <input name="lastName" class="input" />
    <button class="btn">Update</button>
</form>
