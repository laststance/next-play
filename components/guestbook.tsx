'use client'

export const Guestbook = () => {
  return (
    <section className="border-boder flex w-full flex-1 flex-col items-center rounded-b-lg border">
      <div className="grid w-full place-content-center">
        <h2 className="p-8 text-2xl">Guestbook</h2>
      </div>

      <form className="grid w-[80%] grid-cols-[auto_1fr] items-center gap-4 px-8">
        <label htmlFor="guest">guest</label>
        <input
          name="guest"
          type="text"
          className="border-border rounded-md border px-3 py-2"
        />
        <label htmlFor="message">message</label>
        <textarea
          name="message"
          className="border-border rounded-md border px-3 py-2"
        ></textarea>
      </form>
    </section>
  )
}
