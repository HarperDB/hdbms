import { Button, Input } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <form>
        <Field invalid label="Email" errorText="Invalid email">
        <Input 
          id="email"
          name="email"  
          type="email"
          placeholder="Email"
          onChange={() => { console.log('email changed') }}
        />
        </Field>
        <Field invalid label="Password" errorText="Invalid password">
        <Input 
          required
          id="password"
          name="password" 
          type="password" 
          placeholder="Password" 
        />
        </Field>
        <Button type="submit">Sign In</Button>
      </form>
    </div>
  )
}

export default SignIn
