Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;

public static class SpriteSplitter {
  public static void Split(string input, string outputDirectory) {
    using (var source = new Bitmap(input)) {
      var names = new[] { "south", "south-west", "west", "north-west", "north", "north-east", "east", "south-east" };
      int cellWidth = source.Width / 8;

      for (int frame = 0; frame < 8; frame++) {
        int left = frame * cellWidth;
        int right = frame == 7 ? source.Width : (frame + 1) * cellWidth;
        int width = right - left;
        var seen = new bool[width * source.Height];
        var best = new List<Point>();

        for (int y = 0; y < source.Height; y++) {
          for (int x = 0; x < width; x++) {
            int index = y * width + x;
            if (seen[index] || source.GetPixel(left + x, y).A < 24) continue;
            var component = new List<Point>();
            var queue = new Queue<Point>();
            queue.Enqueue(new Point(x, y));
            seen[index] = true;
            while (queue.Count > 0) {
              var point = queue.Dequeue();
              component.Add(point);
              int[,] neighbours = { { point.X - 1, point.Y }, { point.X + 1, point.Y }, { point.X, point.Y - 1 }, { point.X, point.Y + 1 } };
              for (int n = 0; n < 4; n++) {
                int nx = neighbours[n, 0], ny = neighbours[n, 1];
                if (nx < 0 || nx >= width || ny < 0 || ny >= source.Height) continue;
                int ni = ny * width + nx;
                if (!seen[ni] && source.GetPixel(left + nx, ny).A >= 24) {
                  seen[ni] = true;
                  queue.Enqueue(new Point(nx, ny));
                }
              }
            }
            if (component.Count > best.Count) best = component;
          }
        }

        int minX = width, minY = source.Height, maxX = 0, maxY = 0;
        foreach (var point in best) {
          minX = Math.Min(minX, point.X); maxX = Math.Max(maxX, point.X);
          minY = Math.Min(minY, point.Y); maxY = Math.Max(maxY, point.Y);
        }
        int cropWidth = maxX - minX + 1, cropHeight = maxY - minY + 1;
        using (var output = new Bitmap(320, 760, PixelFormat.Format32bppArgb)) {
          using (var graphics = Graphics.FromImage(output)) {
            graphics.Clear(Color.Transparent);
            int destinationX = (output.Width - cropWidth) / 2;
            int destinationY = output.Height - cropHeight - 8;
            graphics.DrawImage(source,
              new Rectangle(destinationX, destinationY, cropWidth, cropHeight),
              new Rectangle(left + minX, minY, cropWidth, cropHeight),
              GraphicsUnit.Pixel);
          }
          output.Save(System.IO.Path.Combine(outputDirectory, names[frame] + ".png"), ImageFormat.Png);
        }
      }
    }
  }
}
'@ -ReferencedAssemblies System.Drawing

$repositoryRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$inputAtlas = Join-Path $repositoryRoot 'public\sprites\urgentiste-dechoc-idle-8dir-v2.png'
$outputDirectory = Join-Path $repositoryRoot 'public\sprites\urgentiste-dechoc\idle'
New-Item -ItemType Directory -Force $outputDirectory | Out-Null
[SpriteSplitter]::Split($inputAtlas, $outputDirectory)
Write-Output "Eight isolated idle sprites created in $outputDirectory"
