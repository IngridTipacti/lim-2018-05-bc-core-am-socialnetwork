describe('verificacionMail', () => {
      it('debería ser una funcion', () => {
        assert.equal(typeof window.verificacionMail, 'function')
      });
      it('debería retornar true para "xxxx@xxxx.xxx"', () => {
        assert.deepEqual(window.verificacionMail("xxxx@xxx.xxx", true))
      });
      it('debería retornar false para "x"', () => {
        assert.deepEqual(window.verificacionMail("x", false))
      });
    })
