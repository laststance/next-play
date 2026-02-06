'use client'

export const Guestbook = () => {
  return (
    <section className="w-full h-full border border-boder rounded-b-lg">
      <h2 className="text-2xl">Guestbook</h2>
      <form>
        <label htmlFor="name">name</label>
        <input name="name" type="text" />
        <textarea name="message"></textarea>
      </form>
    </section>
  )
}
