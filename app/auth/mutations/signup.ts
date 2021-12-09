import { resolver, SecurePassword } from "blitz"
import db, { Role } from "db"
import { Signup } from "app/auth/validations"

export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, surname, name }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        hashedPassword,
        name,
        surname,
        roles: [Role.USER],
      },
      select: { id: true, name: true, surname: true, email: true, roles: true },
    })

    await ctx.session.$create({ userId: user.id, roles: user.roles })
    return user
  }
)
