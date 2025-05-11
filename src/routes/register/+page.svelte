<script lang="ts">
    import { z } from "zod";
    import { UserSchema } from "$lib/zodSchemas";
    import { enhance } from "$app/forms"; // Import the enhance action
</script>

<form method="POST" use:enhance>
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
