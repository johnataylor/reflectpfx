
using var sw = File.CreateText("testPfxExamples.js");

sw.WriteLine("const roundtrip = require('./testHelper.js').roundtrip;");
sw.WriteLine();
sw.WriteLine("describe('examples', function() {");
sw.WriteLine();

foreach (var fileName in Directory.EnumerateFiles(@"C:\private\Power-Fx\src\tests\Microsoft.PowerFx.Core.Tests\ExpressionTestCases\"))
{
    var name = Path.GetFileNameWithoutExtension(fileName);
    sw.WriteLine($"  describe.skip('{name}', function() {{");
    foreach (var line in File.ReadAllLines(fileName).Where(line => line.StartsWith(">>")))
    {
        var expression = line.Substring(3);
        sw.WriteLine($"    it(`{expression}`, function() {{ roundtrip(this.test.title) }});");
    }
    sw.WriteLine("  });");
    sw.WriteLine();
}

sw.WriteLine("});");
