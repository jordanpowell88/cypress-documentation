/* eslint-disable no-console */

const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkDirective = require('remark-directive')
const remarkDirectives = require('../remark-directives')
const remarkRehype = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')
const fs = require('fs')
const path = require('path')

jest.mock('fs')

const CONTENT_PATH = path.join(__dirname, '../../content')

const process = (file) => {
  return unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkDirectives)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(file)
    .then((file) => {
      return file.contents
    })
}

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(console, 'error')
  jest.spyOn(console, 'warn')
})

it('should attempt to include files relative to the content directory', async () => {
  await process('::include{file=example}')
  expect(fs.readFileSync).toHaveBeenCalledWith(
    `${CONTENT_PATH}/example`,
    expect.anything()
  )

  await process('::include{file=/path/to/example}')
  expect(fs.readFileSync).toHaveBeenCalledWith(
    `${CONTENT_PATH}/path/to/example`,
    expect.anything()
  )
})

it('should replace directive with markdown parsed file contents', async () => {
  fs.readFileSync.mockReturnValue('# aaa\n## bbb')
  const result = await process('::include{file=content}')

  expect(result).toBe(`<h1>aaa</h1>\n<h2>bbb</h2>`)
})

it('should log an error and remove directive if file attribute is omitted', async () => {
  const result = await process('# aaa\n::include\n## bbb')

  expect(console.error).toHaveBeenCalledWith(
    '[include directive]',
    expect.stringMatching(/"file" attribute/)
  )

  expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
})

it('should error and remove directive if file attribute refers to missing file', async () => {
  fs.readFileSync.mockImplementation(jest.requireActual('fs').readFileSync)
  const result = await process('# aaa\n::include{file=invalid}\n## bbb')

  expect(console.error).toHaveBeenCalledWith(
    '[include directive]',
    expect.stringMatching(/Failed to read file: invalid/),
    expect.objectContaining(
      new Error(
        `ENOENT: no such file or directory, open '${CONTENT_PATH}/invalid'`
      )
    )
  )

  expect(console.error).toHaveBeenCalled()
  expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
})
