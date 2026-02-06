'use client'

export const Guestbook = () => {
  return (
    <section className="border-boder flex w-full flex-1 flex-col items-center rounded-b-lg border">
      <div className="grid w-full place-content-center">
        <h2 className="p-8 text-2xl">Guestbook</h2>
      </div>

      <form className="flex w-full flex-col items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <label htmlFor="guest">guest</label>
          <input name="guest" type="text" className="border-border border" />
        </div>
        <div className="flex flex-1 items-center gap-4">
          <label htmlFor="message">message</label>
          <textarea name="message" className="border-border border"></textarea>
        </div>
      </form>
    </section>
  )
}
