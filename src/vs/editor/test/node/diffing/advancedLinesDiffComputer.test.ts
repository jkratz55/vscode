/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { Range } from 'vs/editor/common/core/range';
import { RangeMapping } from 'vs/editor/common/diff/rangeMapping';
import { LinesSliceCharSequence, getLineRangeMapping } from 'vs/editor/common/diff/advancedLinesDiffComputer';
import { OffsetRange } from 'vs/editor/common/core/offsetRange';

suite('lineRangeMapping', () => {
	test('1', () => {
		assert.deepStrictEqual(
			getLineRangeMapping(
				new RangeMapping(
					new Range(2, 1, 3, 1),
					new Range(2, 1, 2, 1)
				),
				[
					'const abc = "helloworld".split("");',
					'',
					''
				],
				[
					'const asciiLower = "helloworld".split("");',
					''
				]
			).toString(),
			"{[2,3)->[2,2)}"
		);
	});

	test('2', () => {
		assert.deepStrictEqual(
			getLineRangeMapping(
				new RangeMapping(
					new Range(2, 1, 2, 1),
					new Range(2, 1, 4, 1),
				),
				[
					'',
					'',
				],
				[
					'',
					'',
					'',
					'',
				]
			).toString(),
			"{[2,2)->[2,4)}"
		);
	});
});

suite('LinesSliceCharSequence', () => {
	// Create tests for translateOffset

	const sequence = new LinesSliceCharSequence(
		[
			'line1: foo',
			'line2: fizzbuzz',
			'line3: barr',
			'line4: hello world',
			'line5: bazz',
		],
		new OffsetRange(1, 4), true
	);

	test('translateOffset', () => {
		assert.deepStrictEqual(
			{ result: OffsetRange.ofLength(sequence.length).map(offset => sequence.translateOffset(offset).toString()) },
			({
				result: [
					"(2,1)", "(2,2)", "(2,3)", "(2,4)", "(2,5)", "(2,6)", "(2,7)", "(2,8)", "(2,9)", "(2,10)", "(2,11)",
					"(2,12)", "(2,13)", "(2,14)", "(2,15)", "(2,16)",

					"(3,1)", "(3,2)", "(3,3)", "(3,4)", "(3,5)", "(3,6)", "(3,7)", "(3,8)", "(3,9)", "(3,10)", "(3,11)", "(3,12)",

					"(4,1)", "(4,2)", "(4,3)", "(4,4)", "(4,5)", "(4,6)", "(4,7)", "(4,8)", "(4,9)",
					"(4,10)", "(4,11)", "(4,12)", "(4,13)", "(4,14)", "(4,15)", "(4,16)", "(4,17)",
					"(4,18)", "(4,19)"
				]
			})
		);
	});

	test('extendToFullLines', () => {
		assert.deepStrictEqual(
			{ result: sequence.getText(sequence.extendToFullLines(new OffsetRange(20, 25))) },
			({ result: "line3: barr\n" })
		);

		assert.deepStrictEqual(
			{ result: sequence.getText(sequence.extendToFullLines(new OffsetRange(20, 45))) },
			({ result: "line3: barr\nline4: hello world\n" })
		);
	});
});
